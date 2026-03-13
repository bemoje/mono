# @mono/template

A TypeScript template engine with schema validation and pluggable rendering strategies.

## Exports

<!-- EXPORTS_START -->

- [**JsonFileTemplateStrategy**](./src/strategies/JsonFileTemplateStrategy.ts): Template strategy for handling JSON file templates with structured object schemas. Converts structured objects to formatted JSON strings and parses JSON strings back to typed objects. Uses pretty-printing with 2-space indentation for human-readable output.
- [**StringTemplateStrategy**](./src/strategies/StringTemplateStrategy.ts): Template strategy for handling simple string templates. Provides pass-through behavior for string templates where the template and rendered output are both plain strings. Useful for text-based templates that don't require parsing or complex structure.
- [**Template**](./src/Template/Template.ts): A generic template engine that supports variable substitution using the Strategy pattern. Validates templates and options against TypeBox schemas and renders templates with provided data. Supports mustache-style `{{variable}}` syntax for variable substitution.
- [**TextFileTemplateStrategy**](./src/strategies/TextFileTemplateStrategy.ts): Template strategy for handling multi-line text file templates. Converts arrays of strings to newline-separated text and parses text files back to string arrays by splitting on newlines. Ideal for processing configuration files, scripts, or any line-based text content.

<!-- EXPORTS_END -->

## Template Strategies

### StringTemplateStrategy

For simple string templates with pass-through behavior:

```typescript
import { StringTemplateStrategy } from '@mono/template'

const strategy = new StringTemplateStrategy()
const template = new Template({
  strategy,
  optionsSchema: Type.Object({ user: Type.String({ default: 'Anonymous' }) }),
  template: 'Welcome {{user}}!',
})
```

### JsonFileTemplateStrategy

For structured JSON templates with pretty-printing:

```typescript
import { JsonFileTemplateStrategy } from '@mono/template'

const strategy = new JsonFileTemplateStrategy(
  Type.Object({ name: Type.String(), version: Type.String(), author: Type.String() })
)

const template = new Template({
  strategy,
  optionsSchema: Type.Object({
    packageName: Type.String(),
    version: Type.String({ default: '1.0.0' }),
    author: Type.String({ default: 'Unknown' }),
  }),
  template: { name: '{{packageName}}', version: '{{version}}', author: '{{author}}' },
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
  optionsSchema: Type.Object({ className: Type.String(), author: Type.String({ default: 'Developer' }) }),
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
