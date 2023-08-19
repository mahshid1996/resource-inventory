const logger = require('../logger');

/*
Note is an array item in logical and physical resources
This file is for keeping all the note history on the patch method
and checking note items with threshold value of note config
*/
async function noteHistory(context) {
  var t0 = new Date();
 
  try {
    var t0 = new Date();
    var {
      app,
      path,
      params: {
        url
      }
    } = context;

    if(path === 'v1/physical-resource' || path === 'v1/logical-resource'){

    const service = app.service(path);
    //if note was exist on the payload
    if (context.data.note !== undefined) {
      logger.applog('info', t0, `Adding note into noteHistory for ${context.id}`);
      //getting current note 
      const note = context.data.note;
      logger.applog('info', t0, `Starting getting all note data for ${context.id}`);
      //getting previous note
      const info = await service.get(context.id, {
        url,
        provider: undefined,
        query: {
          $select: ['note']
        }
      });
      let noteHistory = info.note;
      //getting threshold of note config
      const noteConfig = (path === 'v1/physical-resource')?app.get('configNoteForPhysicalRes'):app.get('configNoteForLogicalRes');

      const wholeCapacity = parseInt(noteHistory.length) +  parseInt(note.length);
      
      if (wholeCapacity > noteConfig) {
        const itemsToRemove = wholeCapacity - noteConfig;
        formatString(note,noteHistory,itemsToRemove);
      }else{
        formatString(note,noteHistory,-1);
      }
      logger.applog('info', t0, `Getting all note data for ${context.id} successfully`);

      //updating note of context obj
      context.data.note = noteHistory;
    }
    logger.applog('info', t0, `Finish noteHistory`);
  }
    return context;
  } catch (error) {
    logger.applog('error', t0, `During getting note history error is ${JSON.stringify(error)}`);
    throw error;
  }

}


function formatString(note,noteHistory,itemsToRemove) {
  let isOkForRemove = false;
  note.forEach((item) => {
    if (!noteHistory.some((historyItem) => historyItem.text === item.text && historyItem.authorRole === item.authorRole && JSON.stringify(historyItem.date) === JSON.stringify(item.date))) {
      noteHistory.push(item);
      isOkForRemove = true;
    }
  });
  if (isOkForRemove && itemsToRemove > 0) {
    noteHistory.splice(0, itemsToRemove);
    }
  return noteHistory;
}

module.exports = {
  noteHistory
};
