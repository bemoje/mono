import cp from 'node:child_process'
import fs from 'fs-extra'

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

// get libs
const libs = await fs.readdir('libs')

// publish libs
for (const lib of libs) {
  publishLib(lib)
}

/** Publish a library to npm if the version in package.json is different from the version in the npm registry. */
function publishLib(lib) {
  let pkg
  try {
    pkg = fs.readJsonSync(`libs/${lib}/package.json`, 'utf-8')
  } catch (error) {
    console.error(`Failed to read package.json for libs/${lib}:`, error.message)
    return
  }

  const pkgVersion = pkg.version
  if (!pkgVersion) {
    console.error(`No version specified in package.json for libs/${lib}. Skipping publish.`)
    return
  }

  let npmVersion
  try {
    npmVersion = cp.execSync(`npm view @bemoje/${lib} version`)
  } catch (_) {
    console.warn(`Package @bemoje/${lib} not found in npm registry.`)
    npmVersion = '0.0.0'
  }

  if (npmVersion.toString().trim() === pkgVersion) {
    console.log(`@bemoje/${lib}@${pkgVersion}`)
  } else {
    console.warn(
      `Version mismatch for ${lib}: package.json version is ${pkgVersion}, but npm registry version is ${npmVersion.toString().trim()}.`
    )

    try {
      cp.execSync(`yarn workspace @mono/${lib} exec "yarn build && cd dist && npm publish && cd ../"`, {
        stdio: 'inherit',
        shell: true,
      })
    } catch (error) {
      console.error(`Failed to publish libs/${lib}:`, error.message)
    }
  }
}
