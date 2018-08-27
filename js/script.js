const runTest = (cm) => {
  /**
   * This function is assigned to every CodeMirror instance.
   * It is executed for a single CM instance when the key
   * combination Ctrl-Enter is fired. It takes as a parameter
   * the CM instance, evaluates the succeed.js test and
   * outputs the result in the corresponding area.
   */

  // Evaluate code/run tests
  let test = eval(cm.doc.getValue())
  // Get text area element
  let tarea = cm.getTextArea()
  // Get the code element (result element)
  let code = document.querySelector(`#${tarea.id} ~ pre code`)
  // Display results
  code.innerHTML = test.toHTML()
}

const initCodeExamples = () => {
  document.querySelectorAll('.example textarea').forEach(tarea => {
    // Fix space/tab issue with textarea
    tarea.value = tarea.value.replace(/^([\t ]+)/gm, '')
    // Create CodeMirror instance
    let cm = CodeMirror.fromTextArea(tarea, {
      mode: 'javascript',
      lineNumbers: false
    })
    // Set key combo for succeed.js (Ctrl-Enter)
    cm.setOption('extraKeys', {
      'Ctrl-Enter': runTest
    })
    // Run test initially
    runTest(cm)
  })
}

const initNavAnchors = () => {
  // Select all anchors from the nav panel
  document.querySelectorAll("#nav-panel a").forEach(a => {
    a.addEventListener('click', e => {
      // Cancel the default event
      // e.preventDefault()
    })
  })
}

window.addEventListener('load', () => {
  initNavAnchors()
  initCodeExamples()
})

const toggleNav = () => {
  // document.querySelector('#nav-toggle').classList.toggle('toggled')
  document.querySelector('#nav-panel').classList.toggle('toggled')
}