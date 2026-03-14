import cp from 'child_process'
import fs from 'fs-extra'

if (!process.env.CI) {
  // ensure logged in to npm before publishing
  try {
    const whoami = cp.execSync(`npm whoami`, { shell: true, stdio: 'pipe', encoding: 'utf-8' }).trim()
    if (whoami.split('\n').length === 1) {
      console.log('whoami:', whoami)
    } else {
      throw new Error('Not logged in')
    }
  } catch (_) {
    cp.execSync(`npm login`, { shell: true, stdio: 'inherit' })
  }
}

const upCommands = []

// get libs
const apps = await fs.readdir('apps')
for (const app of apps) {
  publish('apps', app)
}

// publish libs
const libs = await fs.readdir('libs')
for (const lib of libs) {
  publish('libs', lib)
}

// print up commands
console.log()
console.log(upCommands.join('\n'))

for (const cmd of upCommands) {
  try {
    cp.execSync(cmd, { shell: true, stdio: 'inherit' })
  } catch (_) {
    console.warn(`Command failed: "${cmd}"`)
  }
}

function publish(dir, ws) {
  let pkg
  try {
    pkg = fs.readJsonSync(`${dir}/${ws}/package.json`, 'utf-8')
  } catch (error) {
    console.error(`Failed to read package.json for ${dir}/${ws}:`, error.message)
    return
  }

  if (!pkg.scripts?.npmPublish) {
    console.warn(`No npmPublish script found in package.json for ${dir}/${ws}. Skipping publish.`)
    return
  }

  const distPkgName = [
    pkg.publishConfig?.scope ?? (pkg.name.includes('/') ? pkg.name.split('/')[0] : undefined),
    pkg.publishConfig?.name ?? (pkg.name.includes('/') ? pkg.name.split('/').slice(1).join('/') : pkg.name),
  ]
    .filter(Boolean)
    .join('/')

  let distPkg
  try {
    distPkg = fs.readJsonSync(`${dir}/${ws}/dist/package.json`, 'utf-8')
  } catch (error) {
    console.warn(`Failed to read dist/package.json for ${dir}/${ws}:`, error.message)
    distPkg = pkg
  }

  const pkgVersion = pkg.version
  if (!pkgVersion) {
    console.error(`No version specified in package.json for ${dir}/${ws}. Skipping publish.`)
    return
  }

  let npmVersion
  try {
    npmVersion = cp.execSync(`npm view ${distPkgName} version`)
  } catch (_) {
    console.warn(`Package ${distPkgName} not found in npm registry.`)
    npmVersion = '0.0.0'
  }

  if (npmVersion.toString().trim() === pkgVersion) {
    console.log(`${distPkgName}@${pkgVersion}`)
  } else {
    console.warn(
      `Version mismatch for ${ws}: package.json version is ${pkgVersion}, but npm registry version is ${npmVersion.toString().trim()}.`
    )

    try {
      cp.execSync(`yarn workspace ${pkg.name} exec "cd dist && npm publish && cd ../"`, {
        stdio: 'inherit',
        shell: true,
      })
      upCommands.push(`yarn up ${distPkgName}@${distPkg.version}`)
    } catch (error) {
      console.error(`Failed to publish ${dir}/${ws}:`, error.message)
    }
  }
}
