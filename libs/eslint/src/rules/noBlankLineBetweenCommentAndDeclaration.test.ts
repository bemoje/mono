import * as vitest from 'vitest'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { noBlankLineBetweenCommentAndDeclaration } from './noBlankLineBetweenCommentAndDeclaration'

RuleTester.afterAll = vitest.afterAll
RuleTester.it = vitest.it
RuleTester.itOnly = vitest.it.only
RuleTester.describe = vitest.describe

const ruleTester = new RuleTester()

ruleTester.run('no-blank-line-between-comment-and-declaration', noBlankLineBetweenCommentAndDeclaration, {
  valid: [
    {
      name: 'export function declaration',
      code: [
        `/**`, //
        ` * Blah`,
        ` */`,
        `export function func() {`,
        `  //`,
        `}`,
      ].join('\n'), //
    },
    {
      name: 'function declaration',
      code: [
        `/**`, //
        ` * Blah`,
        ` */`,
        `function func() {`,
        `  //`,
        `}`,
      ].join('\n'), //
    },
    {
      name: 'const declaration',
      code: [
        `/**`, //
        ` * Blah`,
        ` */`,
        `export const thing = 4`,
      ].join('\n'), //
    },
    {
      name: 'class method declaration',
      code: [
        `class A {`,
        `  /**`, //
        `   * Method`,
        `   */`,
        `  method() {`,
        `    // Do something`,
        `  }`,
        `}`,
      ].join('\n'), //
    },
    {
      name: 'with line comment between',
      code: [
        `/**`, //
        ` * Blah`,
        ` */`,
        `// line comment`,
        `export const thing = 4`,
      ].join('\n'), //
    },
  ],

  invalid: [
    {
      name: 'export function declaration',
      code: [
        `/**`, //
        ` * Blah`,
        ` */`,
        ``,
        `export function func() {`,
        `  //`,
        `}`,
      ].join('\n'), //
      errors: [{ messageId: 'no-blank-line-between-comment-and-declaration' }], //
      output: [
        `/**`, //
        ` * Blah`,
        ` */`,
        `export function func() {`,
        `  //`,
        `}`,
      ].join('\n'), //
    },
    {
      name: 'function declaration',
      code: [
        `/**`, //
        ` * Blah`,
        ` */`,
        ``,
        `function func() {`,
        `  //`,
        `}`,
      ].join('\n'), //
      errors: [{ messageId: 'no-blank-line-between-comment-and-declaration' }], //
      output: [
        `/**`, //
        ` * Blah`,
        ` */`,
        `function func() {`,
        `  //`,
        `}`,
      ].join('\n'), //
    },
    {
      name: 'const declaration',
      code: [
        `/**`, //
        ` * Blah`,
        ` */`,
        ``,
        `export const thing = 4`,
      ].join('\n'), //
      errors: [{ messageId: 'no-blank-line-between-comment-and-declaration' }], //
      output: [
        `/**`, //
        ` * Blah`,
        ` */`,
        `export const thing = 4`,
      ].join('\n'), //
    },
    {
      name: 'class method declaration',
      code: [
        `class A {`,
        `  /**`, //
        `   * Method`,
        `   */`,
        ``,
        `  method() {`,
        `    // Do something`,
        `  }`,
        ``,
        `  /**`, //
        `   * Method2`,
        `   */`,
        ``,
        ``,
        ``,
        `  method2() {`,
        `    // Do something`,
        `  }`,
        `}`,
      ].join('\n'), //
      errors: [
        { messageId: 'no-blank-line-between-comment-and-declaration' },
        { messageId: 'no-blank-line-between-comment-and-declaration' },
      ], //
      output: [
        `class A {`,
        `  /**`, //
        `   * Method`,
        `   */`,
        `  method() {`,
        `    // Do something`,
        `  }`,
        ``,
        `  /**`, //
        `   * Method2`,
        `   */`,
        `  method2() {`,
        `    // Do something`,
        `  }`,
        `}`,
      ].join('\n'), //
    },
  ],
})
