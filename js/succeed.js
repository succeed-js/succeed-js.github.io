/* global Prism */

const succeed = (title) => ({
  title: title,
  succeeded: undefined,
  subject: {
    type: undefined,
    name: undefined,
    value: undefined
  },
  __options__: {
    or: false,
    and: false,
    last: undefined,
    /**
     * Contains result objects from performed checks.
     *
     * Result object = {
     *   passes: {boolean},
     *   method: {string}, // eg. if(), is(), equals() ...
     *   status: {string},  // eg. Skipped!, Succeeded!, Failed!, ...
     *   message: {string}
     * }
     */
    results: [],
    done: false
  },
  /**
   * Assigns a test subject to the testing object.
   *
   * @param {any} subject - The subject to be tested
   *
   * @returns {succeed} - The testing object
   */
  if: function (subject) {
    /**
     * This function will be executed in it's assignable form
     * only if the __options__.done property is false.
     *
     * If __options__.done is true the function will pass
     * the object to the next function in the chain.
     */
    // If the testing is done return object
    if (this.__options__.done === true) {
      this.__options__.results.push({
        passess: false,
        method: 'if()',
        status: 'Skipped!',
        message: 'The test was marked as done before reaching this phase. Probably due to and()'
      })

      return this
    }

    // Get the type of the subject
    this.subject.type = this.helpers.type(subject)

    // Set the name or the value of the subject
    if (this.subject.type === 'function') {
      this.subject.name = subject
    } else {
      this.subject.value = subject
    }

    // Return the object for chaining
    return this
  },
  /**
   * Checks if the test subject is the given type.
   *
   * @param {string} type - The expected type of the subject
   * type = [null, undefined, array, string, object, function, ...]
   *
   * @returns {succeed} - The testing object
   */
  is: function (type) {
    /**
     * This function will be executed in it's comparable form
     * only if the __options__.done property is false.
     *
     * If __options__.done is true the function will pass7
     * the object to the next function in the chain.
     */

    // Create result object
    let result = {
      method: `is()`,
    }

    // If test is done
    if (this.__options__.done) {
      // Configure result object
      result.passes = false
      result.status = 'Skipped!'
      result.message = 'The test was marked as done before reaching this phase. Probably due to and()'

      // Push a result object
      this.__options__.results.push(result)

      // Return object for chaining
      return this
    }

    // Set last result according to the check
    this.__options__.last = this.subject.type === type

    // Add a results object
    if (this.__options__.last) {
      // Configure and push result object
      result.passes = true
      result.status = 'Succeeded!'
      result.message = `The type of the subject matches the expected type (${type}).`
      this.__options__.results.push(result)
    } else {
      // Configure and push result object
      result.passes = false
      result.status = 'Failed!'
      result.message = `Expected subject to be of type '${type}', instead it was of type '${this.subject.type}'.`
      this.__options__.results.push(result)
    }

    // Return object for chaining
    return this
  },
  /**
   * Checks if the subject's value does not match the given value.
   *
   * @param {any} expected - The value which the subject should not match
   *
   * @returns {succeed} - The tesing object
   */
  not: function (expected) {
    // If test is marked as done, skip
    if (this.__options__.done) {
      this.__options__.results.push({
        passes: false,
        method: 'not()',
        status: 'Skipped!',
        message: 'The test was marked as done before reaching this phase. Probably due to and()'
      })

      return this
    }

    // Check if subject's value matches the expected
    this.__options__.last = this.subject.value !== expected
    // Get the type of the expected
    let exType = this.helpers.type(expected)

    // Add results object
    if (this.__options__.last) {
      this.__options__.results.push({
        passes: true,
        method: 'not()',
        status: 'Succeeded!',
        message: `The value of the subject is (${this.subject.value} [${this.subject.type}]) and does not match (${expected} [${exType}]), as expected.`
      })
    } else {
      this.__options__.results.push({
        passes: false,
        method: 'not()',
        status: 'Failed!',
        message: `The value of the subject is equal to (${expected} [${exType}]), but it shouldn't!`
      })
    }

    // Return object for chaining
    return this
  },
  /**
   * Checks if the subject's value matches the expected.
   *
   * @param {any} expected - The expected value
   *
   * @returns {succeed} - The testing object
  */
  equals: function (expected) {
    // If test is marked as done, skip
    if (this.__options__.done) {
      this.__options__.results.push({
        passes: false,
        method: 'not()',
        status: 'Skipped!',
        message: 'The test was marked as done before reaching this phase. Probably due to and()'
      })

      return this
    }

    // Check if the subject's value matches the expected
    this.__options__.last = this.subject.value === expected
    // Get the type of the expected
    let exType = this.helpers.type(expected)

    // Add results object
    if (this.__options__.last) {
      this.__options__.results.push({
        passes: true,
        method: 'equals()',
        status: 'Succeeded!',
        message: `The value of the subject matches the expected value (${expected} [${this.subject.type}]).`
      })
    } else {
      this.__options__.results.push({
        passes: false,
        method: 'equals()',
        status: 'Failed!',
        message: `The value of the subject (${this.subject.value} [${this.subject.type}]) does not match the expected value (${expected} [${exType}])!`
      })
    }

    // Return object for chaining
    return this
  },
  and: function () {
    // If last result was false the whole test is failed
    if (this.__options__.last === false) {
      this.__options__.done = true
    } else if (this.__options__.last === true) {
      this.__options__.and = true
      this.__options__.or = false
    }

    return this
  },
  or: function () {
    this.__options__.or = true
    this.__options__.and = false

    return this
  },
  exec: function (...params) {
    // If subject is not a function add a results object
    if (this.subject.type !== 'function') {
      this.__options__.results.push({
        passes: false,
        method: 'exec()',
        status: 'Failed!',
        message: 'The subject is not a function and can\'t be executed with the given parameters!'
      })

      // Return object for chaining
      return this
    }

    // Subject is a function, execute, get value and change type
    this.subject.value = this.subject.name(...params)
    this.subject.type = this.helpers.type(this.subject.value)

    // Return object for chaining
    return this
  },
  check: function () {
    // Decide if all tests must pass or some
    let allMustPass = true
    if (this.__options__.or) allMustPass = false

    // If all tests must pass
    this.succeeded = allMustPass ? this.__options__.results.every(r => r.passes) : this.__options__.results.some(r => r.passes)

    // Print the results
    return this
  },
  toHTML: function () {
    let html = ''

    // Print title and overall success
    html += `# Test '${this.title}': ${this.succeeded ? 'Succeeded!' : 'Failed!'}\n`

    // Print every test result
    this.__options__.results.forEach(result => {
      html += `## ${result.method}: ${result.status}\n${result.message}\n`
    })

    return Prism.highlight(html, Prism.languages.markdown, 'markdown')
  },
  helpers: {
    type: function (test) {
      if (test === null) return 'null'
      else if (test === undefined) return 'undefined'
      else if (Array.isArray(test)) return 'array'
      else if (typeof test === 'number') return 'number'
      else if (typeof test === 'object') return 'object'
      else if (typeof test === 'string') return 'string'
      else if (typeof test === 'boolean') return 'boolean'
      else if (typeof test === 'function') return 'function'
      else return 'other'
    }
  }
})
