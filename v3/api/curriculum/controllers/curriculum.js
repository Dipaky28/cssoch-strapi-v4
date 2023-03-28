'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
// const { sanitizeEntity, finder } = require('strapi-utils');


//function to filter puzzle fields
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
        item["Level"] = puzzleEntity["Level"];
        item["Puzzle Question"] = puzzleEntity["PuzzleQuestion"];
        item["Question Image"] = (puzzleEntity["QuestionImage"])? puzzleEntity["QuestionImage"].url: null;
        item["Correct Option"] = puzzleEntity["CorrectOption"];
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
            item["Options"] = {
                OptionA: puzzleEntity["ImageOptions"].OptionA.url,
                OptionB: puzzleEntity["ImageOptions"].OptionB.url,
                OptionC: puzzleEntity["ImageOptions"].OptionC.url,
                OptionD: puzzleEntity["ImageOptions"].OptionD.url
            }
        }

        //create options array for text
        if (puzzleEntity["TextOptions"] !== null) {
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
             
            // Get blockly images 
            let blocklyImages = await strapi.query('blockly-images').find();
            if(blocklyImages){
                for(let image of blocklyImages[0].Images){
                item["blocklyImages"].push(image.url);
                }
            }
            
            // Iterate success message array and get message
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

        //push item object to filterGameSet array
        filterGameSet.push(item);
    }

    return filterGameSet;
}


//function to filter grade fields
async function filterGrade(entity, grade) {
    let filterGrade = []

    for (let item of entity.AssignModule[grade]) {
        let filterModule = {};
        let moduleEntity = await strapi.query('module').findOne({ "id": item.id });

        filterModule["Module Name"] = moduleEntity["Module Name"];
        filterModule["module_id"] = moduleEntity["id"]
        filterModule["Stories"] = [];

        //filter story fields
        if(moduleEntity.Story){
            for (let story of moduleEntity.Story.stories) {
                let item = {};

                //find story using story id
                let storyEntity = await strapi.query('story').findOne({ "id": story.id });
                item["Story Name"] = storyEntity["Story Name"]
                item["Frames"] = [];

                //filter frames field
                for (let frame of storyEntity.Frames) {

                    item["Frames"].push({
                        "text": frame.Text,
                        "image_url":(frame.image_name)? frame.image_name.url: null,
                    });
                }
                filterModule["Stories"].push(item);
            }
        }



        if(moduleEntity.Puzzle){
            //call function to filter puzzle fields
            filterModule["Puzzles"] = await filterPuzzle(moduleEntity.Puzzle.puzzles);
        }else{
            filterModule["Puzzles"] = [];
        }


        if(moduleEntity.Games){
            //call function to filter game sets fields
            filterModule["Game Sets"] = await filterGameSet(moduleEntity.Games.GameSets);
        }else{
            filterModule["Game Sets"] =[];
        }


        if(moduleEntity.Assessment){
            //filter assessment field
            filterModule["Assessment"] = {
                "Puzzle": (moduleEntity.Assessment.Puzzle)? await filterPuzzle(moduleEntity.Assessment.Puzzle.puzzles): [],
                "Game Set":(moduleEntity.Assessment.Games)? await filterGameSet(moduleEntity.Assessment.Games.GameSets): [],
            }
        }else{
            filterModule["Assessment"] = {
                "Puzzle": [],
                "Game Set": []
            }
        }

        if(moduleEntity.Project && moduleEntity.Project.length>0){
            filterModule["Project"]=true;
        }else{
            filterModule["Project"]=false;
        }

        filterGrade.push(filterModule);

    }
    // console.log(filterGrade);
    return filterGrade;
};

module.exports = {
    async find(ctx) {
        let curriculumEntities = await strapi.services.curriculum.find();

        return Promise.all(curriculumEntities.map(async (entity) => {

            return {
                "curriculumn_id": entity._id,
                "Curriculum Name": entity["Curriculum Name"],
                "AssignModule": {
                    Grade1: await filterGrade(entity, "Grade1"),
                    Grade2: await filterGrade(entity, "Grade2"),
                    Grade3: await filterGrade(entity, "Grade3"),
                    Grade4: await filterGrade(entity, "Grade4"),
                    Grade5: await filterGrade(entity, "Grade5"),
                }
            };

        }));

    },
    async findCurriculumBySchoolName(ctx) {
        let schoolEntity = await strapi.query('curriculum').findOne({ "Curriculum Name": ctx.params["schoolname"] });
        return {
            "Curriculum Name": schoolEntity["Curriculum Name"],
            "AssignModule": {
                Grade1: await filterGrade(schoolEntity, "Grade1"),
                Grade2: await filterGrade(schoolEntity, "Grade2"),
                Grade3: await filterGrade(schoolEntity, "Grade3"),
                Grade4: await filterGrade(schoolEntity, "Grade4"),
                Grade5: await filterGrade(schoolEntity, "Grade5"),
            }
        };
    },
    async findOne(ctx) {
      const id = ctx.params.id;

      if (id) {
        let schoolEntity = await strapi.query('curriculum').findOne({id: id})
        return {
          "Curriculum Name": schoolEntity["Curriculum Name"],
          "curriculumn_id": schoolEntity._id,
          AssignModule: {
            Grade1: await filterGrade(schoolEntity, "Grade1"),
            Grade2: await filterGrade(schoolEntity, "Grade2"),
            Grade3: await filterGrade(schoolEntity, "Grade3"),
            Grade4: await filterGrade(schoolEntity, "Grade4"),
            Grade5: await filterGrade(schoolEntity, "Grade5"),
          },
        };
      }
      return []
    },
    async getModulesByCurriculumnAndGrade(ctx) {
      const {curriculumnID, grade} = ctx.params;

      if (curriculumnID) {
        let schoolEntity = await strapi.query("curriculum").findOne({ id: curriculumnID });
        return {
          modules: await filterGrade(schoolEntity, `Grade${grade}`)
        }
      }

      return []
    },
    async getAllCurriculumn() {
        let curriculumEntities = await strapi.services.curriculum.find();
        console.log(curriculumEntities)
        return Promise.all(curriculumEntities.map(async (entity) => {
            console.log(entity)
            return {
                "curriculumn_id": entity._id,
                "Curriculum Name": entity["Curriculum Name"],
            };

        }));
      }
};
