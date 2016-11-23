// Checkout (cmd alt ctrl o)

import {getCurrentBranch, checkForFile, createFailAlert, exec, createSelect} from '../common'

export default function (context) {
  if (!checkForFile(context)) { return }
  try {
    var listBranchesCommand = 'git for-each-ref --format=\'%(refname:short)\' refs/heads/'
    var listBranches = exec(context, listBranchesCommand)
    if (listBranches != null && listBranches != '') {
      listBranches = listBranches.split('\n')
      listBranches.pop() // last item is always an empty string
      var currentBranch = getCurrentBranch(context)
      var currentIndex = listBranches.indexOf(currentBranch) == -1 ? 0 : listBranches.indexOf(currentBranch)
      var branch = createSelect(context, 'Checkout branch', listBranches, currentIndex, 'Checkout')
      if (branch.responseCode == 1000 && branch.index >= 0 && branch.index < listBranches.length) {
        var selectedBranch = listBranches[branch.index]
        var command = 'git checkout -q ' + selectedBranch
        exec(context, command)
        var app = NSApp.delegate()
        app.refreshCurrentDocument()
        context.document.showMessage(`Switched to branch '${selectedBranch}'`)
      }
    } else {
      context.document.showMessage('No branches')
    }
  } catch (e) {
    createFailAlert(context, 'Failed...', e, true)
  }
}
