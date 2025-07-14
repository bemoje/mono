# mono

This is a private for-fun-only TypeScript monorepo with internal libraries, utils, cli tools and apps. Do not rely on any of the contained code for production use.

## Libraries

### Coverage

| Metric     | Total | Covered | Percentage |
| ---------- | ----- | ------- | ---------- |
| Lines      | 4467  | 4160    | 93.12%     |
| Statements | 4467  | 4160    | 93.12%     |
| Functions  | 591   | 539     | 91.2%      |
| Branches   | 1554  | 1489    | 95.81%     |

### array

- `arrAverage` - Calculates the average of an array of numbers.
- `arrEachToString` - Coerce each element of an array to string.
- `arrFindIndicesOf` - Returns an array of indices where the predicate function returns true for the corresponding element in the input array.
- `arrGetOrDefault` - Get array element at index or create it using factory function if it doesn't exist.
- `arrHasDuplicates` - Checks if an array has any duplicate elements.
- `arrIndicesOf` - Returns all indexes at which an element is found.
- `arrLast` - Returns the last element of an array
- `arrMapMutable` - This function takes an array and a callback function as arguments
- `arrObjectsToTable` - Convert an array of objects to a two-dimensional table.
- `arrObjectsUniqueKeys` - Returns an array of all unique object keys found in an array of objects.
- `arrRemove` - Remove a given element from a copy of a given array and return the resulting array.
- `arrRemoveDuplicates` - Remove duplicates from an array
- `arrRemoveMutable` - Remove elements in-place from an array.
- `arrShuffle` - Shuffle items in an array in-place
- `arrSortNumeric` - Sorts an array of numbers, bigints, or booleans in ascending order.
- `arrSortedInsertionIndex` - Returns an index in the sorted array where the specified value could be inserted while maintaining the sorted order of the array
- `arrSum` - Calculates the sum of an array of numbers.
- `arrSwap` - Swaps two elements in an array
- `arrTableAssertRowsSameLength` - Asserts that all rows in a 2D array have the same length.
- `arrTableEachToString` - Coerce each value of a 2D array table to string.
- `arrTableIterateAsObjects` - Generator that iterates through a 2D array table, yielding objects with header keys and row values.
- `arrTableRemoveColumns` - Removes specified columns from a 2D array table.
- `arrTableToCsv` - Converts a 2D array to a CSV string.
- `arrTableToObjects` - Converts a 2D array representing a table into an array of objects.
- `arrayToString` - Short and condensed string representation of an array, easy to read for error outputs or similar.
- `removeDuplicates` - Remove duplicates from an array

### composition

- `Inspector` - Returns a deep clone of the default Inspector options.
- `ParentRelationTypes` - Manages parent-child relationships between constructor types, tracking hierarchical connections and providing debugging capabilities.
- `Parenting` - A WeakMap for parent references.
- `View` - Base class providing view functionality over a target object using the Composition pattern.
- `ignoreValuesDefaults` - Default options for ignoring specific values during object inspection.
- `ignoreValuesFilterDefaults` - Default filter functions for ignoring values during object inspection.
- `inheritProxifiedPrototype` - Inherits prototype properties from a target class to a viewer class with proxification, excluding specified keys.
- `inheritProxifiedPrototypeProperty` - Inherits a single prototype property from a target class to a viewer class with proxification.
- `inspectDefaults` - Default options for Node.js util.inspect with enhanced settings for better debugging output.
- `inspectorDefaults` - The default inspector configuration options.

### config

- `ConfigFile` - Configuration file manager that provides schema validation and file I/O using the Strategy pattern.
- `JsonFileStrategy` - Strategy for loading and saving configuration data as JSON files.
- `SchemaConfigStrategy` - Strategy for validating configuration data against a TypeBox schema and applying default values.

### crypto

- `decrypt` - Decrypts a string that was encrypted using encrypt()
- `encrypt` - Encrypts a string using AES-256-CBC with a random IV

### date

- `Timer` - Returns a function that returns the elapsed time since invokation.
- `dateString` - Reutnrs the date formatted as: yyyy-MM-dd
- `daysToMs` - Converts days to milliseconds.
- `getWeek` - Get the week number of the year for a given date using Danish locale.
- `hasCooldownElapsed` - Determines if a specified cooldown period has elapsed since a given date.
- `hoursToMs` - Converts hours to milliseconds.
- `minutesToMs` - Converts minutes to milliseconds.
- `monthNameDa` - Returns the name, in Danish language, of the month corresponding to the provided month number.
- `monthNameDaRelative` - Get the (Danish) name of the month relative to the current month.
- `msSinceDate` - Calculates the number of milliseconds that have elapsed since the given date.
- `secondsToMs` - Converts seconds to milliseconds.
- `stripTime` - Remove the time component from a date, returning only the date part.
- `today` - Get the UTC date today, time stripped
- `yesterday` - Get the UTC date yesterday, time stripped

### decorators

- `assertDescriptorValueIsFunction` - Asserts that a property descriptor contains a function value.
- `lazyProp` - Decorator to temporarily memoize a method or getter accessor property.
- `memoizeAsync` - Decorator to memoize an async method.
- `memoizeSync` - Decorator to memoize a sync method.

### fn

- `bindArg` - Binds a specified argument to the provided function, returning a new function that requires only the remaining arguments at call time.
- `bindArgs` - Binds specified arguments to the provided function, returning a new function that requires only the remaining arguments at call time.
- `dethisify` - Converts a function from a class method by by making the first argument take the place of the 'this' context
- `functionSpy` - Action to perform before the function returns.
- `maxConcurrency` - The maximum number of concurrent executions.
- `once` - Wraps the function and returns a function that only allows the wrapped function to be executed once
- `onceStrict` - Wraps the function and returns a function that only allows the wrapped function to be called once.
- `onceSync` - Wraps the function and returns a  function that only allows the wrapped function to be executed once
- `preserveNameAndLength` - Preserves the name and length of a function or class constructor
- `sequence` - Creates a function that executes the provided async functions sequentially in order.
- `setLength` - Set the length of a function.
- `setName` - Set the name of a function.
- `thisProxy` - Returns a function that redirects or 'proxies' the 'this' context of the input function to either a property of a given key, or a callback that returns the target object.
- `thisify` - Converts a function to a class method by making the 'this' context the first argument.
- `transformReturnValue` - Wraps a function to transform its return value using a transform function.
- `wrapMethods` - Wrap methods, getters and setters of an object with custom logic.

### fs

- `deleteOlderThan` - Delete files older than a given timestamp
- `getFileAge` - Retrieves the age of a file in milliseconds.
- `getFirstFileInDir` - Get the name of the first file (not directory) found in a directory.
- `readFileFirstLine` - Reads the first line of a file asynchronously.
- `removeDataUrlSchemePrefix` - Removes the data URL scheme prefix from a given string.
- `unzip` - Extract contents of a zip file at a given filerpath into a given directory
- `updateFile` - Updates a file by reading its content, applying a transformation function, and writing back the result
- `updateFileLines` - Updates a file by applying a transformation function to an array of lines
- `updateFileLinesSync` - Synchronous version of
- `updateFileSync` - Synchronous version of
- `updateJsonFile` - Updates a JSON file by applying a transformation function to the parsed content
- `updateJsonFileSync` - Synchronous version of
- `walkDirectory` - On filesystems where inodes are not unique (eg

### is

- `IsArrayWhereEach` - Creates a validator function that checks whether the input is an array where all elements are valid according to every validator provided.
- `IsFileExt` - Creates a validator function that checks if a string has the specified file extension (case-insensitive).
- `IsLength` - Creates a function that validates if the length of the input is equal to the specified length
- `createGtValidator` - Creates a validator function that checks if a value is a number greater than the specified limit.
- `createGteValidator` - Creates a validator function that checks if a value is a number greater than or equal to the specified limit.
- `createLtValidator` - Creates a validator function that checks if a value is a number less than the specified limit.
- `createLteValidator` - Creates a validator function that checks if a value is a number less than or equal to the specified limit.
- `ensureThat` - Ensures a value meets validation criteria, throwing an error if it doesn't.
- `ensureThatDefined` - Same as ensureThat except that if the value is undefined, it is considered valid.
- `isArray` - Checks if the provided value is an array.
- `isChar` - Determines whether a string is a single character.
- `isClass` - Checks if the given value is a constructor function using 'class' syntax
- `isConstructor` - Checks if the given value is a valid constructor function.
- `isDefined` - This function checks if a value is defined or not
- `isDefinedValue` - Checks if the provided value is defined (i.e., not
- `isDigit` - Returns true if the given character is a digit between 0 and 9.
- `isDigits` - Returns true if the given string is a string of digits between 0 and 9.
- `isEven` - Checks if a number is even.
- `isHex` - Checks if a string is a hexadecimal number
- `isHexOrUnicode` - Checks if a given string is a hexadecimal or unicode.
- `isIntRange` - Determine whether the input is an array of two integers in ascending order.
- `isInteger` - Checks if the provided number is an integer.
- `isLen2` - Determine whether the input has length of 2.
- `isNamedFunction` - Checks if the provided value is a named function.
- `isNamedFunctionArray` - Checks if the provided value is an array containing only named functions.
- `isNegativeInteger` - Checks if a given number is a negative integer.
- `isNegativeNumber` - Checks if a given number is negative or zero.
- `isNonZeroNegativeInteger` - Checks if a given number is a negative non-zero integer.
- `isNonZeroNegativeNumber` - Checks if a given value is a negative number less than zero.
- `isNonZeroPositiveInteger` - Checks if a given number is a positive non-zero integer.
- `isNonZeroPositiveNumber` - Checks if a given value is a positive number greater than zero.
- `isNull` - Checks if the provided value is null.
- `isNumArrayAscending` - Determine whether the input is an array of numbers in ascending order
- `isNumericString` - Checks if a given string is numeric.
- `isObject` - Checks if the provided value is an object (null, arrays and functions not included).
- `isObjectType` - Checks if the provided value is an object type (null and functions included, array not included).
- `isOdd` - Checks if a number is odd.
- `isPosIntArray` - Determine whether the input is a positive (including zero) integer array.
- `isPosIntRange` - Checks if the input is an array of exactly two positive integers in ascending order, representing a valid range.
- `isPositiveInteger` - Checks if a given number is a positive integer.
- `isPositiveNumber` - Checks if a given value is a positive number (including zero).
- `isPrimitive` - Checks if the provided value is a primitive type (null, undefined, bigint, boolean, number, string or symbol).
- `isPrototype` - Checks if the given value is a prototype object
- `isStringArray` - Determine whether the input is a string array.
- `isStringWithNoSpacesOrDashes` - Checks if the provided value is a string that contains no spaces or dashes.
- `isUniqueNumArrayAscending` - Determine whether the input is an array of numbers in ascending order
- `isValidNumber` - Checks if the provided value is a valid finite number (not NaN or Infinity).

### iter

- `countUniques` - Count unique occurrences of values in an iterable, returning a sorted map by count descending.
- `filterIterable` - Filter map entries based on a predicate function.
- `forEachIterable` - Execute a callback function for each entry in a map-like iterable.
- `mapIterable` - Transform both keys and values of map entries.
- `mapIterableKeys` - Transform map keys while preserving values.
- `mapIterableValues` - Transform map values while preserving keys.
- `reduceIterable` - Reduce a map-like iterable to a single value.
- `toObjectIterable` - Convert a map-like iterable to a regular object.

### map

- `ExtMap` - Custom inspection method for better debugging output.
- `TimeoutWeakMap` - Gets a value or creates it using a factory function if it doesn't exist
- `entriesArray` - Returns an array of all key-value pairs in the map
- `getOrDefault` - Get a value from an array
- `isGenericMap` - Checks if the provided value implements the Map interface with the specified required properties.
- `keysArray` - Returns an array of all keys in the map
- `mapGetOrDefault` - Gets a value from a map or creates it using a factory function if it doesn't exist.
- `mapLoad` - Loads multiple entries into the map from an iterable.
- `mapReverse` - Reverses the order of entries in a Map.
- `mapUpdate` - Updates a value in the map using an update function.
- `sort` - Sorts the map entries using a custom comparison function and updates the map in place
- `sortByKeys` - Sorts the map entries by their keys and updates the map in place.
- `sortByValues` - Sorts the map entries by their values and updates the map in place.
- `toMap` - Converts a GenericMap to a native Map.
- `valuesArray` - Returns an array of all values in the map

### monorepo

- `AbstractBase` - Abstract base class that provides common functionality for monorepo management including parenting and inspection capabilities.
- `AbstractCode` - Abstract base class for representing code structures in the monorepo with inspection and preview capabilities.
- `CodeBlock` - Represents a block of code within a larger code structure, defined by an index range.
- `File` - Read the file contents.
- `ImportKeywords` - Represents the imported keywords/specifiers in an import statement.
- `ImportSpecifiers` - Returns the keys added to the global namespace by this import specifier.
- `ImportStatement` - Represents an import statement in TypeScript code with parsing and manipulation capabilities.
- `ModuleSpecifier` - Returns whether import is an other, but local workspace in the monorepo.
- `MonoRepo` - Represents a monorepo with workspace management, TypeScript configuration, and dependency analysis capabilities.
- `TestFile` - Represents a test file in the monorepo with TypeScript code analysis capabilities.
- `TsCode` - Represents TypeScript code with import parsing and manipulation capabilities.
- `TsFile` - Represents a TypeScript file in the monorepo with code analysis and dependency tracking capabilities.
- `Workspace` - Returns the workspace's cwd-relative path.
- `getAllImports` - Retrieves all import statements from TypeScript source files across all workspaces in the monorepo.
- `getRepoRootDirpath` - Get the root directory path of the monorepo by finding the package.json with workspaces configuration.
- `getWorkspaceDirpaths` - Get all workspace directory paths by reading the workspace patterns from the root package.json.
- `resolveModuleImportPath` - Returns the resolved import path (relative from repo root)
- `semverVersionBump` - Bumps the semantic versioning (SemVer) of a given version string or array based on the specified level

### node

- `StringStream` - Extension of Node's native Readable class for converting a string into a Readable stream.
- `argvHasHelpFlag` - Checks if the command line arguments contain a help flag (--help or -h).
- `execInherit` - Executes a command synchronously with inherited stdio, returning a promise with the output.
- `execOutput` - Helper function to execute a shell command and return stdout and stderr without throwing on error
- `execute` - The working directory to execute the batch script in
- `formatTableForTerminal` - Formats a 2D array of strings as a terminal table with optional headers and styling.
- `getCurrentMemoryUsage` - Get the current heap memory usage in megabytes.
- `isTerminalColorSupported` - Check if colored terminal output is (probably) supported.
- `memoryUsage` - Returns the memory usage of the Node.js process with values converted from bytes to megabytes and rounded to the specified precision.
- `prompt` - Prompt the user for input.
- `shellSpawnProgram` - Spawns a program using child_process.spawn with promise-based interface and optional stdio inheritance control.
- `spawnChildProcess` - Spawn a child process.
- `spawnNodeProcess` - Using child_process.spawn to start a node process works differently on windows and non-windows systems
- `startPowerShellScript` - Executes a PowerShell script with arguments and returns stdout/stderr.
- `streamToString` - Drain a Readable into a string.
- `timer` - Executes a task and logs the execution time with the specified name.
- `toError` - Converts the given value to an Error object

### number

- `NumberFormatter` - Parse a formatted string to a number.
- `bytesToKilobytes` - Converts a given number of bytes into kilobytes.
- `bytesToMegabytes` - Converts a given number of bytes into megabytes.
- `determineNumberLocale` - Determine whether a set of valid number strings are formatted in da-DK or en-US locale.
- `numRange` - Generates an array of numbers within a specified range.
- `randomIntBetween` - Returns a random integer between min (inclusive) and max (inclusive).
- `round` - Round a given number with a given precision
- `roundDown` - Round a given number down with a given precision
- `roundToNearest` - Round a given number to a given nearest whole number.
- `roundUp` - Round a given number up with a given precision
- `roundWith` - Round a given number with a given precision and rounding function

### object

- `CreateArrayMerger` - ?
- `CreateObjectMerger` - ?
- `GetKeysPreset` - ?
- `OptionsConfigurator` - Returns data without applying defaults for missing values.
- `arrAssign` - Array assignment function that merges arrays excluding null and undefined values.
- `className` - Get the class name of an object from its constructor.
- `classPrototype` - Get the class prototype object relating to an object or class.
- `constructorOf` - Returns the constructor of the given object.
- `define` - Utility object aggregating all property definition functions.
- `defineAccessors` - Define accessor properties (getter and setter) on an object with enhanced descriptor handling.
- `defineGetter` - Define a getter property on an object with enhanced descriptor handling.
- `defineLazyProperty` - Define a lazy property that evaluates its getter on first access and then caches the value.
- `defineMethod` - Define a method property on an object with enhanced descriptor handling.
- `defineProperty` - Utility function for defining properties on objects with enhanced descriptor handling.
- `defineSetter` - Define a setter property on an object with enhanced descriptor handling.
- `defineValue` - Define a value property on an object with enhanced descriptor handling.
- `deleteNullishPropsMutable` - Mutably delete enumerable properties with null or undefined values.
- `entriesOf` - Same as Object.entries except the keys are typed as keyof T.
- `filterObject` - Filter an object's own enumerable properties by predicate.
- `filterObjectMutable` - Mutably filter an object's own properties based on a given predicate.
- `getClassChain` - Get the class constructor chain for any target (constructor, prototype, or instance)
- `getConfigurableMethodOrGetterKeys` - Returns an array of keys representing configurable methods or getters of an object.
- `getKeys` - Returns an array of the own property keys of an object
- `getOwnProperty` - Returns a given own property value of a given object.
- `getPrototypeChain` - Get the prototype chain of any object
- `getSuperClass` - Get the immediate superclass of a target
- `getSuperClasses` - Get all superclasses of a target (excluding the target itself by default)
- `hasClassPrototypeProperty` - Determines if a property is defined on an object's prototype, not including the object itself or its super classes' prototypes.
- `hasOwnProperty` - Object.prototype.hasOwnProperty.call
- `hasProperty` - Determines if a property is defined on an object, including 'own' and prototype chain.
- `hasPrototypeChainProperty` - Determines if a property is defined on an object's prototype prototype chain, not including the object itself.
- `inheritPrototypeMembers` - Copies prototype members from a source constructor to a target constructor, excluding specified keys.
- `inheritStaticMembers` - Copies static members from a source constructor to a target constructor, excluding specified keys.
- `isAccessorDescriptor` - Check if the given descriptor is an accessor descriptor.
- `isEnumerable` - Check if the property is enumerable.
- `isMethodValueDescriptor` - Checks if a property descriptor represents a method (function value descriptor).
- `isValueDescriptor` - Check if the given descriptor is a value descriptor.
- `iterableFirstElement` - Returns the first element of an iterable object.
- `iterateClasses` - Iterator version of getClassChain - yields constructors/classes.
- `iterateObject` - Generator that performs a depth-first traversal of an object's structure
- `iteratePrototypes` - Iterator version of getPrototypeChain - yields prototype objects.
- `keysOf` - Same as Object.keys except the keys are typed as string keys of T.
- `lazyObjectProp` - Define a getter method on an object that on first access will write the value to the object and then return it
- `mapObject` - Maps over an object's values, transforming each value using the provided function.
- `mapObjectEntries` - Maps over an object's entries, transforming both keys and values using the provided function.
- `mapObjectKeys` - Maps over an object's keys, transforming each key using the provided function while preserving values.
- `objAssign` - Like Object.assign, but only copies source object property values != null.
- `objDeepFreeze` - Deep freezes an object
- `objDefineLazyProperty` - Defines a lazy property on an object
- `objDelete` - Deletes a property from an object and returns the modified object.
- `objForEach` - Applies a callback function to each key-value pair in an object.
- `objGet` - Retrieves the value associated with the specified key from an object.
- `objGetOrDefault` - Gets a property value from an object or creates it using a factory function if it doesn't exist.
- `objGetOrDefaultValue` - This function attempts to retrieve a value from an object using a provided key
- `objHas` - Checks if an object has a specific key.
- `objIsEmpty` - Checks if an object is empty.
- `objOmitKeysMutable` - Deletes the specified keys from an object in a mutable way.
- `objOwnKeyNames` - Identical to Object.getOwnPropertyNames, but typed
- `objOwnKeySymbols` - Identical to Object.getOwnPropertyNames, but typed
- `objOwnKeys` - Identical to Reflect.ownKeys, but typed
- `objPropertyValueToGetter` - Converts the specified properties of an object into getter functions.
- `objReduce` - Reduces the values of an object into a single value.
- `objSet` - Sets a value for a key in an object and returns the value.
- `objSize` - Returns the number of enumerable keys in an object.
- `objSortKeys` - Sorts the keys of an object in alphabetical order unless a custom compare function is provided.
- `objToMap` - Converts an object to a Map.
- `objUpdate` - Updates the value of a specific key in an object using a callback function.
- `objUpdatePropertyDescriptors` - Updates the property descriptors of the specified properties on the given object.
- `objValues` - Identical to Object.values, but typed
- `propertyIsEnumerable` - Calls Object.prototype.propertyIsEnumerable on the given object.
- `readOwnPrototypePropertyAs` - Gets the property descriptor of the target object at key, and reads the value of the property
- `realizeLazyProperty` - Realizes a lazy property by defining it as a non-writable, non-configurable value on the object.
- `setEnumerable` - Sets the enumerable property of the specified properties of an object to true.
- `setNonConfigurable` - Sets the specified properties of an object as non-configurable.
- `setNonEnumerable` - Sets the specified properties of an object as non-enumerable.
- `setNonWritable` - Sets the specified properties of an object to be non-writable.
- `setWritable` - Sets the specified properties of an object to be writable.
- `sortKeys` - Sort an object's keys.
- `sortKeysLike` - Sorts the keys of an object in the given order.
- `staticClassKeysOf` - Keys always present in any class object.
- `valuesOf` - Get the values of an object with type-safe return value.

### os

- `defaultOpenInEditorCommand` - Get the default command to open a file in in a text editor
- `getAppDataPath` - Get the app data path, depending on the current OS (win, osx, linux).
- `getDefaultBrowserWindows` - Gets the default browser identifier on Windows by querying the registry.
- `getHomeDirectory` - Returns the home directory of the current user.
- `getOS` - Determines the current operating system
- `getTempDataPath` - Returns a path to the os tmpdir location.
- `getTempFilepath` - Returns a path to a temporary file with the given basename and subpath.
- `isLinux` - Checks if the current platform is Linux
- `isLinuxProgramInstalled` - LINUX ONLY: Returns whether a program is installed on the system
- `isOSX` - Checks if the current platform is OSX
- `isVsCodeInstalled` - Returns whether Visual Studio Code is installed on the system.
- `isWindows` - Checks if the current platform is Windows.
- `openInDefaultBrowserCommand` - Gets the command to open a URL in the default browser for the current operating system.
- `winExplorerOpenDirectory` - Opens a directory in Windows Explorer

### path

- `SemanticExtnamePrefix` - Constants for semantic filename prefixes used to categorize files by their purpose.
- `cwd` - Join paths starting from process.cwd()
- `dirnameDeep` - Returns the absolute path of the parent directory of the given path.
- `hasBasename` - Checks if a file path has any of the specified basenames.
- `hasExtname` - Checks if a file path has any of the specified file extensions.
- `hasExtnamePrefix` - Checks if a file path has any of the specified semantic extension prefixes (e.g., .test.ts, .spec.js).
- `hasParentDirname` - Whether fspath is a subpath of a parent directory with the given name.
- `isRelative` - Whether a path is a relative string, ie
- `isUnc` - Determines if a given filepath is a UNC path.
- `isValidWin32` - Check whether a provided windows filesystem path string is valid according to: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx
- `prefixFilename` - Append string to the beginning of the filename.
- `root` - Returns the root directory of a given path.
- `suffixFilename` - Append string to the end of the filename.
- `toCwdRelative` - Solve the relative path from the process.cwd() path to the  At times we have two absolute paths, and we need to derive the relative path from one to the other
- `toWin32` - Ensures win32 backslashes are used instead of forward slashes.

### profiler

- `AbstractFunctionIdentifier` - Abstract base class for identifying and naming functions in profiling contexts.
- `AbstractMethodIdentifier` - Abstract base class for identifying and naming method functions in profiling contexts.
- `FunctionProfiler` - Slowest execution time in microseconds
- `ModuleMethodIdentifier` - Identifies methods within module objects for profiling purposes.
- `ModuleMethodProfilerFactory` - Factory for creating profilers for module method functions using the Factory pattern.
- `Profiler` - Class profiling decorator
- `ProfilerWrapMethodsStrategy` - Strategy for wrapping object methods with profiling capabilities using the Strategy pattern.
- `PrototypeMethodIdentifier` - Identifies methods on class prototypes for profiling purposes.
- `PrototypeMethodProfilerFactory` - Factory for creating profilers for prototype method functions using the Factory pattern.
- `StandaloneFunctionIdentifier` - Identifies standalone functions for profiling purposes.
- `StaticMethodIdentifier` - Identifies static methods on classes for profiling purposes.
- `StaticMethodProfilerFactory` - Factory for creating profilers for static method functions using the Factory pattern.
- `profilerWrap` - Wraps a function with a

### regex

- `regexEscapeString` - Escapes special characters in a string to be used in a regular expression.
- `rexec` - Easily perform regex 'exec' on a string

### stacktrace

- `enablePrettyStackTrace` - Enables pretty stack trace formatting for uncaught exceptions.
- `prettyStackTrace` - Formats stack traces with colors and improved readability for debugging.

### string

- `camelCase` - Converts a string to camel case.
- `countFloatDecimals` - Counts the number of decimal places in a floating-point number.
- `endsWithIncompleteUtfPairSurrogate` - Returns true if the string ends with an incomplete UTF-16 surrogate pair
- `strCountCharOccurances` - Counts the number of occurrences of a specific character in a string.
- `strCountChars` - Counts the number of occurrences of each character in a string and returns a Map where the keys are the characters and the values are their counts.
- `strEnsureEndsWith` - Ensures that a string ends with a specified substring
- `strEnsureStartsWith` - Ensures that a string starts with a specified substring
- `strFirstCharToLowerCase` - Converts the first character of a string to lowercase.
- `strFirstCharToUpperCase` - Converts the first character of a string to uppercase.
- `strHashToBuffer` - Hash a string into a buffer with a given algorithm
- `strHashToString` - Hash a string into a buffer with a given algorithm
- `strHashToStringDJB2` - Hashes a string using the DJB2 algorithm, returning a numeric hash value.
- `strHashToUint32Array` - Hash a string into an array of unsigned 32-bit integers.
- `strIsLowerCase` - Checks if the given string is in lower case.
- `strIsMultiLine` - Checks if a string contains multiple lines.
- `strIsUpperCase` - Checks if the given string is in upper case.
- `strMaxTwoConsecutiveEmptyLines` - Replaces all occurrences of more than two consecutive empty lines with two empty lines.
- `strNoConsecutiveEmptyLines` - Removes consecutive empty lines from a given string.
- `strNoConsecutiveWhitespace` - Removes consecutive whitespace characters in a string and replaces them with a single space.
- `strParseBoolean` - Parses a string into a boolean.
- `strPrefixCamelCased` - Prepend a camelCased string
- `strPrependLines` - Prepend each line of a string with a specified string.
- `strRemoveDuplicateChars` - Removes duplicate characters from a string.
- `strRemoveEmptyLines` - Removes all empty lines from a given string.
- `strRemoveFirstAndLastLine` - Removes the first and last line from a given string.
- `strRemoveNewLines` - Removes all new line characters from a string.
- `strRepeat` - Repeats the given string
- `strReplaceAll` - Replaces all occurrences of a substring in a string with a specified replacement.
- `strSortChars` - Sorts the characters in a string in alphabetical order.
- `strSplitAndTrim` - Splits a string by a specified delimiter and trims each resulting substring
- `strSplitCamelCase` - Returns an array of words in the string
- `strToCharCodes` - Converts a string to an array of character codes.
- `strToCharSet` - Converts a string to a set of unique characters.
- `strToGetterMethodName` - Prepend a camelCased string with 'get'.
- `strToSetterMethodName` - Prepend a camelCased string with 'set'.
- `strToSortedCharSet` - Converts a string to a sorted set of unique characters.
- `strTrimLines` - Trims leading and trailing whitespace from each line in a string.
- `strTrimLinesLeft` - Trims the leading whitespace from each line in a string.
- `strTrimLinesRight` - Trims trailing whitespace from each line in a string.
- `strUnwrap` - Removes the specified left and right substrings from the input string.
- `strWrapBetween` - Wraps a string between two other strings.
- `strWrapIn` - Wraps a given string with another string.
- `strWrapInAngleBrackets` - Wraps a string in angle brackets.
- `strWrapInBraces` - Wraps a given string in braces.
- `strWrapInBrackets` - Wraps a string in brackets.
- `strWrapInDoubleQuotes` - Wraps a given string in double quotes.
- `strWrapInParenthesis` - Wraps a given string in parenthesis.
- `strWrapInSingleQuotes` - Wraps a given string in single quotes.
- `stringLineCount` - Count the number of lines in a string.
- `titleCaseWord` - Returns first char upper, rest lower
- `unwrapDoubleQuotes` - Remove double quote from the beginning and end of a string and trims whitespace at the beginning and end of the string

### table

- `TableFormatter` - Formats a 2D array representing a table.
- `formatAsStringTable` - Formats an array of objects into a string table with customizable column formatters.
- `getHeadersFromCsvFile` - Extracts column headers from the first line of a CSV file.
- `iterateTableArrayAsObjects` - Generator that iterates through a 2D table array, yielding objects with header keys and row values.
- `objectsToTable` - Convert an array of objects to a table.
- `parseCsvHeaderLine` - Takes the first line of a CSV string and returns an array of column names.

### template

- `JsonFileTemplateStrategy` - Parses JSON string back to typed object conforming to schema.
- `StringTemplateStrategy` - Returns the populated string as-is (pass-through).
- `Template` - Validates that the template contains all variables defined in the options schema.
- `TextFileTemplateStrategy` - Splits text content into string array by newlines.

### terminal

- `clearTerminal` - Clears the terminal screen using the system's clear command.
- `confirmPrompt` - Prompts the user to confirm in the terminal.

### tschema

- `SchemaValidationError` - Error thrown when a value does not match a given schema
- `assertValidSchema` - Asserts that data conforms to a TypeBox schema, throwing a SchemaValidationError if it doesn't.

### tscode

- `importStatementToOneLiner` - Converts a multi-line import statement to a single line by removing comments and extra whitespace.
- `tsCrlfToLf` - Converts CRLF line endings to LF in TypeScript code.
- `tsExtractImports` - Extract all import statements from a given TypeScript source code string.
- `tsLintFilepath` - Runs ESLint with auto-fix on a TypeScript file, suppressing any errors.
- `tsSortImports` - Sorts import statements in TypeScript code alphabetically by module specifier.
- `tsStripImports` - Removes import statements from TypeScript code.
