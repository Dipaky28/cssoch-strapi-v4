'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function filterPuzzle(modulePuzzles) {
  let filterPuzzle = [];

  //filter Puzzle fields
  for (let puzzle of modulePuzzles) {
    //object to store current puzzle details
    let item = {};

    //query to find particular puzzle entity
    let puzzleEntity = await strapi.query('puzzle').findOne({ "id": puzzle.id });

    //add fields to created item object
    item["Puzzle Name"] = puzzleEntity["PuzzleName"];
    item["puzzle_id"] = puzzleEntity["id"];
    item["Level"] = puzzleEntity["Level"];
    item['Concept'] = await filterConcepts(puzzleEntity["Labels"]["concepts"])
    item["Puzzle Question"] = puzzleEntity["PuzzleQuestion"];
    item["Question Image"] = (puzzleEntity["QuestionImage"])? puzzleEntity["QuestionImage"].url: null;
    item["correct"] = puzzleEntity["CorrectOption"];
    item["Explanation"] = {};

    //get Explanation image url if available
    if (puzzleEntity.Explanation["Image"][0] != null) {
      item["Explanation"].Image = puzzleEntity.Explanation["Image"][0]["url"];
    } else {
      item["Explanation"].Image = "";
    }
    item["Explanation"].Text = puzzleEntity["Explanation"].Explanation;

    //create options array for image
    if (puzzleEntity["ImageOptions"] !== null) {
      item["format"]="picture";
      item["Options"] = {
        OptionA: puzzleEntity["ImageOptions"].OptionA.url,
        OptionB: puzzleEntity["ImageOptions"].OptionB.url,
        OptionC: puzzleEntity["ImageOptions"].OptionC.url,
        OptionD: puzzleEntity["ImageOptions"].OptionD.url
      }
    }

    //create options array for text
    if (puzzleEntity["TextOptions"] !== null) {
      item["format"]="text";
      item["Options"] = {
        OptionA: puzzleEntity["TextOptions"].OptionA,
        OptionB: puzzleEntity["TextOptions"].OptionB,
        OptionC: puzzleEntity["TextOptions"].OptionC,
        OptionD: puzzleEntity["TextOptions"].OptionD
      }

    }

    //push item object to filterPuzzle array
    filterPuzzle.push(item);
  }

  return filterPuzzle;
}


//function to filter gameSet fields
async function filterGameSet(moduleGameSet) {
  let filterGameSet = [];

  //filter game sets field
  for (let game of moduleGameSet) {
    //object to store current gameSet details
    let item = {};

    //query to find particular gameSet entity
    let gameEntity = await strapi.query('game-set').findOne({ "id": game.id });

    item["Game Set Name"] = gameEntity["Game Set Name"];
    item["game_id"] = gameEntity["id"];
    item["Concepts"] = await filterConcepts(gameEntity["Labels"]["concepts"])
    item["Category"] = gameEntity["Category"];
    item["Structure"] = gameEntity["Structure"];
    if(item["Structure"] == "codingEnvironment"){
        item["Config options"] = {
            "Renderer": gameEntity["ConfigOptions"].Renderer,
            "Categories In ToolBoX": gameEntity["ConfigOptions"].CategoriesInToolbox,
        };
    }else{
        item["Config options"] = {
            "Renderer": null,
            "Categories In ToolBoX": null,
        };
    }
    if (gameEntity["DemoVideo"]) {
      item["Demo Video"] = gameEntity["DemoVideo"].url;
    }

    item["Levels"] = [];
    item["Game Types"] = [];
    item["blocklyImages"] = [];
    //filter level fields in game sets
    for (let level of gameEntity.Levels) {
      item["Levels"].push({
        "Instruction": level.Instructions,
        "Config File": level.configFile["url"],
        "DemoLevel": level.DemoLevel,
      });
    }

    //filter gametype field in game sets
    for (let gameType of gameEntity.GameTypes.GameTypes) {
      let gameTypeEntity = await strapi.query('game-type').findOne({ "id": gameType.id });
      // console.log(gameTypeEntity.ErrorMessages);
      let graphicUrls = [];
      let soundUrls = [];
      let errorMessages = [];
      let successMessages = [];
      let ArrowButtons = gameTypeEntity.ArrowButtons;
      //iterate graphics array and get image url
      for (let graphic of gameTypeEntity.Graphics) {
        graphicUrls.push(graphic.url);
      }

      //iterate sounds array and get sound url
      for (let sound of gameTypeEntity.Sounds) {
        soundUrls.push(sound.url);
      }

      //iterate error message array and get message
      for (let error of gameTypeEntity.ErrorMessages) {
        errorMessages.push({
          "Code": error.Code,
          "Message": error.Message,
        })
      }

      //get blockly images 
      let blocklyImages = await strapi.query('blockly-images').find();
      if(blocklyImages){
        for(let image of blocklyImages[0].Images){
          item["blocklyImages"].push(image.url);
        }
      }

      //iterate success message array and get message
      for (let success of gameTypeEntity.SuccessMessage) {
        successMessages.push(success.Message);
      }

      //add to game Type field
      item["Game Types"].push({
        "Game Type Name": gameType["Game Type Name"],
        "Graphics": graphicUrls,
        "Sounds": soundUrls,
        "Error Messages": errorMessages,
        "Success Messages": successMessages,
        "ArrowButtons": ArrowButtons
      })
    }

    //push item object to filterGameSet array
    filterGameSet.push(item);
  }

  return filterGameSet;
}

//function to filter project fields
async function filterProject(moduleProject) {
  let filterProject = [];

  //filter game sets field
  for (let game of moduleProject) {
    //object to store current gameSet details
    let item = {};

    //query to find particular gameSet entity
    let gameEntity = await strapi.query('game-set').findOne({ "id": game.id });

    item["Game Set Name"] = gameEntity["Game Set Name"];
    item["game_id"] = gameEntity["id"];
    item["Concepts"] = await filterConcepts(gameEntity["Labels"]["concepts"]);
    item["Category"] = gameEntity["Category"];
    item["Structure"] = gameEntity["Structure"];
    if(item["Structure"] == "codingEnvironment"){
        item["Config options"] = {
            "Renderer": gameEntity["ConfigOptions"].Renderer,
            "Categories In ToolBoX": gameEntity["ConfigOptions"].CategoriesInToolbox,
        };
    }else{
        item["Config options"] = {
            "Renderer": null,
            "Categories In ToolBoX": null,
        };
    }
    if (gameEntity["DemoVideo"]) {
      item["Demo Video"] = gameEntity["DemoVideo"].url;
    }

    item["Levels"] = [];
    item["Game Types"] = [];
    item["blocklyImages"] = [];
    //filter level fields in game sets
    for (let level of gameEntity.Levels) {
      item["Levels"].push({
        "Instruction": level.Instructions,
        "Config File": level.configFile["url"]
      });
    }

    //filter gametype field in game sets
    for (let gameType of gameEntity.GameTypes.GameTypes) {
      let gameTypeEntity = await strapi.query('game-type').findOne({ "id": gameType.id });
      // console.log(gameTypeEntity.ErrorMessages);
      let graphicUrls = [];
      let soundUrls = [];
      let errorMessages = [];
      let successMessages = [];
      //iterate graphics array and get image url
      for (let graphic of gameTypeEntity.Graphics) {
        graphicUrls.push(graphic.url);
      }

      //iterate sounds array and get sound url
      for (let sound of gameTypeEntity.Sounds) {
        soundUrls.push(sound.url);
      }

      //iterate error message array and get message
      for (let error of gameTypeEntity.ErrorMessages) {
        errorMessages.push({
          "Code": error.Code,
          "Message": error.Message,
        })
      }

      //get blockly images 
      let blocklyImages = await strapi.query('blockly-images').find();
      if(blocklyImages){
        for(let image of blocklyImages[0].Images){
          item["blocklyImages"].push(image.url);
        }
      }

      //iterate success message array and get message
      for (let success of gameTypeEntity.SuccessMessage) {
        successMessages.push(success.Message);
      }

      //add to game Type field
      item["Game Types"].push({
        "Game Type Name": gameType["Game Type Name"],
        "Graphics": graphicUrls,
        "Sounds": soundUrls,
        "Error Messages": errorMessages,
        "Success Messages": successMessages,
      })
    }

    //push item object to filterProject array
    filterProject.push(item);
  }

  return filterProject;
}

async function filterStory(moduleStory) {
  let filterStory = [];
  for (let story of moduleStory) {
    let item = {};

    //find story using story id
    let moduleStory = await strapi.query('story').findOne({ "id": story.id });
    item["Story Name"] = moduleStory["Story Name"]
    item["story_id"] = moduleStory["id"]
    item["concepts"] = await filterConcepts(moduleStory["Labels"]["concepts"])
    item["pages"] = moduleStory.Frames.length;
    item["Frames"] = [];

    //filter frames field
    for (let frame of moduleStory.Frames) {

      item["Frames"].push({
        "text": frame.Text,
        "image_url": (frame.image_name)? frame.image_name.url:null,
      });
    }
    filterStory.push(item);
  }
  return filterStory;
}

async function filterConcepts(moduleConcepts) {
  let filterConcepts = [];
  for (let concept of moduleConcepts) {
    let item = {};

    //find story using story id
    let moduleConcept = await strapi.query('concepts').findOne({ "id": concept.id });
    item["Concept Name"] = moduleConcept["Concept_Title"]
    item["concept_id"] = moduleConcept["id"]
    item["Concept Description"] = moduleConcept['Concept_Description'];
    filterConcepts.push(item);
  }
  return filterConcepts;
}

async function filterGrade(entity, grade) {
  let filterGrade = []

  for (let item of entity.AssignModule[grade]) {
      let filterModule = {};
      let moduleEntity = await strapi.query('module').findOne({ "id": item.id });

      const promises =[];
      
       //check for puzzle available or not
      if(moduleEntity.Puzzle){
        let filterPuzzle = [];
        const modulePuzzles = moduleEntity.Puzzle.puzzles;
        //filter Puzzle fields
        for (let puzzle of modulePuzzles) {
          //object to store current puzzle details
          let item = {};

          //query to find particular puzzle entity
          let puzzleEntity = await strapi.query('puzzle').findOne({ "id": puzzle.id });

          //add fields to created item object
          item["Puzzle Name"] = puzzleEntity["PuzzleName"];
          item["puzzle_id"] = puzzleEntity["id"];
          item["Level"] = puzzleEntity["Level"];
          item['Concept'] = await filterConcepts(puzzleEntity["Labels"]["concepts"])
          filterPuzzle.push(item);
        }
        promises.push(filterPuzzle)
      }else{
        promises.push([])
      }

      //check for games available or not
      if(moduleEntity.Games){
        let filterGameSet = [];
        const moduleGameSet = moduleEntity.Games.GameSets
        //filter game sets field
        for (let game of moduleGameSet) {
          //object to store current gameSet details
          let item = {};

          //query to find particular gameSet entity
          let gameEntity = await strapi.query('game-set').findOne({ "id": game.id });

          item["Game Set Name"] = gameEntity["Game Set Name"];
          item["game_id"] = gameEntity["id"];
          item["Concepts"] = await filterConcepts(gameEntity["Labels"]["concepts"])
          item["Category"] = gameEntity["Category"];
          item["Structure"] = gameEntity["Structure"];

          item["Levels"] = gameEntity.Levels.length;
          filterGameSet.push(item);
        }
        promises.push(filterGameSet)
      }else{
        promises.push([])
      }

    // check for assesment present or not  
      if(moduleEntity.Assessment){
        //for puzzle in assesment
        if(moduleEntity.Assessment.Puzzle){
          let filterPuzzle = [];
        const modulePuzzles = moduleEntity.Assessment.Puzzle.puzzles;
        //filter Puzzle fields
        for (let puzzle of modulePuzzles) {
          //object to store current puzzle details
          let item = {};

          //query to find particular puzzle entity
          let puzzleEntity = await strapi.query('puzzle').findOne({ "id": puzzle.id });

          //add fields to created item object
          item["Puzzle Name"] = puzzleEntity["PuzzleName"];
          item["puzzle_id"] = puzzleEntity["id"];
          item["Level"] = puzzleEntity["Level"];
          item['Concept'] = await filterConcepts(puzzleEntity["Labels"]["concepts"])
          filterPuzzle.push(item);
        }
        promises.push(filterPuzzle)
        }else{
          promises.push(filterPuzzle([]));
        }
        
        //for game in assesment
        if(moduleEntity.Assessment.Games){
          let filterGameSet = [];
        const moduleGameSet = moduleEntity.Assessment.Games.GameSets
        //filter game sets field
        for (let game of moduleGameSet) {
          //object to store current gameSet details
          let item = {};

          //query to find particular gameSet entity
          let gameEntity = await strapi.query('game-set').findOne({ "id": game.id });

          item["Game Set Name"] = gameEntity["Game Set Name"];
          item["game_id"] = gameEntity["id"];
          item["Concepts"] = await filterConcepts(gameEntity["Labels"]["concepts"])
          item["Category"] = gameEntity["Category"];
          item["Structure"] = gameEntity["Structure"];

          item["Levels"] = gameEntity.Levels.length;
          filterGameSet.push(item);
        }
        promises.push(filterGameSet)
        }else{
          promises.push(filterGameSet([]));
        }
      }else{
        promises.push(filterPuzzle([]));
        promises.push(filterGameSet([]))
      }

      if(moduleEntity.Labels){
        promises.push(filterConcepts(moduleEntity.Labels.concepts));
      }else{
        promises.push(filterConcepts([]))
      }

      if(moduleEntity.Project && moduleEntity.Project.games){
        promises.push(filterProject(moduleEntity.Project.games))
      }

      const resolvedPromises = await Promise.all(promises);
      let project = [];
      let puzzles = resolvedPromises[0];
      let games = resolvedPromises[1];
      let puzzleAssesment = resolvedPromises[2];
      let gameAssesment = resolvedPromises[3];
      let concepts = resolvedPromises[4]

      if(promises.length == 6){
        project = resolvedPromises[5];
      }

      filterGrade.push({
        "Module Name": moduleEntity["Module Name"],
        "module_id": moduleEntity["id"],
        "Concepts": concepts,
        "Puzzle_numlevels": moduleEntity.Puzzle?.puzzles.length,
        "Puzzle": puzzles,
        "Game_numlevels": moduleEntity.Games?.GameSets.length,
        "Game": games,
        "Assessment_numlevels":moduleEntity.Assessment?.Puzzle?.puzzles.length + moduleEntity.Assessment?.Games?.GameSets.length,
        "Assessment_puzzle_numlevels": moduleEntity.Assessment?.Puzzle?.puzzles.length,
        "Assessment_game_numlevels": moduleEntity.Assessment?.Games?.GameSets.length,
        "Assessment": {
          "Puzzle": puzzleAssesment,
          "Game Set": gameAssesment
        },
        "Project":project
      });
    }
    return filterGrade;
}



module.exports = {
  async getModulesByGrade(ctx) {
    const modules = await strapi.services.module.find();

    const gradeWiseModules = [];
    let grades;
    for (let moduleEl of modules) {
      if (moduleEl.Labels) {
        grades = moduleEl.Labels.grades;
      }
      //const grades = moduleEl.Labels.grades;
      for (let gradeEl of grades) {
        if (gradeEl.Grade === parseInt(ctx.params.grade)) {
          gradeWiseModules.push(moduleEl);
        }
      }
    }
    return gradeWiseModules;
  },
  async findOne(ctx) {
    const id = ctx.params.id;

    if (id) {
      let moduleEntity = await strapi.query('module').findOne({ id: id })
      const promises =[];
      
       //check for story available or not
      if(moduleEntity.Story){
        promises.push(filterStory(moduleEntity.Story.stories));
      }else{
        promises.push(filterStory([]))
      }
      
       //check for puzzle available or not
      if(moduleEntity.Puzzle){
        promises.push(filterPuzzle(moduleEntity.Puzzle.puzzles));
      }else{
        promises.push(filterPuzzle([]))
      }

      //check for games available or not
      if(moduleEntity.Games){
        promises.push(filterGameSet(moduleEntity.Games.GameSets));
      }else{
        promises.push(filterGameSet([]))
      }

    // check for assesment present or not  
      if(moduleEntity.Assessment){
        //for puzzle in assesment
        if(moduleEntity.Assessment.Puzzle){
          promises.push(filterPuzzle(moduleEntity.Assessment.Puzzle.puzzles));
        }else{
          promises.push(filterPuzzle([]));
        }
        
        //for game in assesment
        if(moduleEntity.Assessment.Games){
          promises.push(filterGameSet(moduleEntity.Assessment.Games.GameSets));
        }else{
          promises.push(filterGameSet([]));
        }
      }else{
        promises.push(filterPuzzle([]));
        promises.push(filterGameSet([]))
      }

      if(moduleEntity.Labels){
        promises.push(filterConcepts(moduleEntity.Labels.concepts));
      }else{
        promises.push(filterConcepts([]))
      }

      if(moduleEntity.Project && moduleEntity.Project.games){
        promises.push(filterProject(moduleEntity.Project.games))
      }

      const resolvedPromises = await Promise.all(promises);
      let project = [];
      let stories = resolvedPromises[0];
      let puzzles = resolvedPromises[1];
      let games = resolvedPromises[2];
      let puzzleAssesment = resolvedPromises[3];
      let gameAssesment = resolvedPromises[4];
      let concepts = resolvedPromises[5]

      if(promises.length == 7){
        project = resolvedPromises[6];
      }

      return {
        "Module Name": moduleEntity["Module Name"],
        "module_id": moduleEntity["id"],
        "Notes": moduleEntity["Notes"],
        "Concepts": concepts,
        "Story": stories,
        "Puzzle": puzzles,
        "Game": games,
        "Assessment": {
          "Puzzle": puzzleAssesment,
          "Game Set": gameAssesment
        },
        "Project":project
      };
    }
    return [];
  },
  async getModulesByCurriculumnAndGrade(ctx) {
    const {curriculumnID, grade} = ctx.params;

    if (curriculumnID) {
      let schoolEntity = await strapi.query("curriculum").findOne({ id: curriculumnID });
      return {
        modules: await filterGrade(schoolEntity, `Grade${grade}`)
      }
    }
    return;
  },
};
