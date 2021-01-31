const xmlCreator = require('./xmlCreator');
const testCaseParser = require('./testCaseXMLParser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const OUTPUT_FOLDER_NAME = 'output/'

function clearFolder(folderName) {
    mkdirp.sync(folderName);
    fs.readdirSync(folderName).forEach(function(file,index) {
        var curPath = folderName + "/" + file;
        fs.unlinkSync(curPath);
    });
}

async function runConversion() {
    clearFolder(OUTPUT_FOLDER_NAME);

    const files = await fs.promises.readdir('input')
    .catch(error => {
        console.error("Could not read directory: \"/input\"", error);
        process.exit(1);
    });

    var total = 0;
    for(const file of files) {
        if(file.startsWith('~$') || file.startsWith('.')) continue;
        var testCases = await testCaseParser.parseTestCases('input/' + file);
        total += testCases.length;
        var xml = xmlCreator.exportTestCases(testCases, new Date(), '1.0');
        fs.writeFile(OUTPUT_FOLDER_NAME + file, xml, function(err) {
            if (err) {
                return console.log('Error importing file ' + file + ': ' + err);
            }
            console.log('Success: file converted with ' + testCases.length + ' test cases: ' + file);
        });
    }
    console.log('Total test cases: ' + total);
}

runConversion();
