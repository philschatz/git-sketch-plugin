// Commits all working file to git (cmd alt ctrl c)
import { sendEvent } from '../analytics'
import { getCurrentBranch, checkForFile, executeSafely, exec, createInputWithCheckbox, exportArtboards } from '../common'
import { getUserPreferences } from '../preferences'

export default function (context) {
  if (!checkForFile(context)) { return }
  executeSafely(function () {
    sendEvent(context, 'Commit', 'Start commiting')
    var currentBranch = getCurrentBranch(context)
    var commitMsg = createInputWithCheckbox(context, 'Commit to "' + currentBranch + '"', 'Generate files for pretty diffs', getUserPreferences().diffByDefault, 'Commit')

    if (commitMsg.responseCode == 1000 && commitMsg.message != null) {
      if (commitMsg.checked) {
        sendEvent(context, 'Commit', 'Export artboards')
        exportArtboards(context)
      }
      sendEvent(context, 'Commit', 'Do commit')
      var command = `git commit -m "${commitMsg.message.split('"').join('\\"')}" -a; exit`
      var message = exec(context, command)
      context.document.showMessage(message.split('\n').join(' '))
    }
  })
}
