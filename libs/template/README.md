# @mono/template

A TypeScript template engine with schema validation and pluggable rendering strategies.

## Template Strategies

### StringTemplateStrategy

For simple string templates with pass-through behavior:

```typescript
import { StringTemplateStrategy } from '@mono/template'

const strategy = new StringTemplateStrategy()
const template = new Template({
  strategy,
  optionsSchema: Type.Object({
    user: Type.String({ default: 'Anonymous' }),
  }),
  template: 'Welcome {{user}}!',
})
```

### JsonFileTemplateStrategy

For structured JSON templates with pretty-printing:

```typescript
import { JsonFileTemplateStrategy } from '@mono/template'

const strategy = new JsonFileTemplateStrategy(
  Type.Object({
    name: Type.String(),
    version: Type.String(),
    author: Type.String(),
  }),
)

const template = new Template({
  strategy,
  optionsSchema: Type.Object({
    packageName: Type.String(),
    version: Type.String({ default: '1.0.0' }),
    author: Type.String({ default: 'Unknown' }),
  }),
  template: {
    name: '{{packageName}}',
    version: '{{version}}',
    author: '{{author}}',
  },
})

const result = template.render({ packageName: 'my-package' })
// Returns formatted JSON object
```

### TextFileTemplateStrategy

For multi-line text templates (arrays of strings):

```typescript
import { TextFileTemplateStrategy } from '@mono/template'

const strategy = new TextFileTemplateStrategy()
const template = new Template({
  strategy,
  optionsSchema: Type.Object({
    className: Type.String(),
    author: Type.String({ default: 'Developer' }),
  }),
  template: [
    '/**',
    ' * {{className}} class',
    ' * @author {{author}}',
    ' */',
    'export class {{className}} {',
    '  // Implementation here',
    '}',
  ],
})
```

## API Reference

### Template Class

#### Constructor Options

```typescript
interface TemplateOptions<TemplateSchema, OptionsSchema> {
  strategy: TemplateStrategy<TemplateSchema>
  optionsSchema?: OptionsSchema
  template: Static<TemplateSchema>
}
```

#### Methods

- **`render(data?)`** - Renders template with provided data, returns typed result
- **`renderString(data?)`** - Renders template and returns string representation
- **`createSchema()`** - Returns the template schema with template as default

### Strategy Interface

```typescript
interface TemplateStrategy<TemplateSchema extends TSchema> {
  readonly templateSchema: TemplateSchema
  templateToString(template: Static<TemplateSchema>): string
  render(populated: string): Static<TemplateSchema>
}
```

## Validation

The template engine performs validation at multiple levels:

1. **Template validation** - Ensures all variables in the options schema are present in the template
2. **Data validation** - Validates render data against the options schema using TypeBox
3. **Schema compliance** - Template structure must conform to the strategy's schema

```typescript
// This will throw an error because {{name}} is missing from template
const invalidTemplate = new Template({
  strategy: new StringTemplateStrategy(),
  optionsSchema: Type.Object({
    name: Type.String(),
    age: Type.Number(),
  }),
  template: 'Hello {{age}}', // Missing {{name}}!
})
```

## Error Handling

The library throws descriptive errors for common issues:

- Missing template variables: `"Template does not include variable: variableName"`
- Invalid render data: `"Invalid options"` (with TypeBox validation details)
- Schema mismatches: TypeBox schema validation errors

## Use Cases

- **Configuration file generation** - JSON configs, environment files
- **Code generation** - Class templates, boilerplate code
- **Documentation** - README templates, API docs
- **Build scripts** - Package.json generation, CI/CD configs
- **Email templates** - HTML/text email content
