const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/genMD.js');

// Questions for the USER
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'Please provide a project title.  (Required)',
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log('Please provide a project title!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'github',
        message: 'Please enter your GitHub username. (Required)',
        validate: githubInput => {
            if (githubInput) {
                return true;
            } else {
                console.log('Please enter your GitHub username!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'repo',
        message: 'Please enter the name of your repo. (Required)',
        validate: repoInput => {
            if (repoInput) {
                return true;
            } else {
                console.log('Please enter the name of your repo!')
            }
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Provide a description of your application. (Required)',
        validate: descInput => {
            if (descInput) {
                return true;
            } else {
                console.log('Please enter a description!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Please provide information for using your application. (Required)',
        validate: usageInput => {
            if (usageInput) {
                return true;
            } else {
                console.log('Please provide information for using your application!');
                return false;
            }
        }
    },
    {
        type: 'checkbox',
        name: 'contents',
        message: 'Any additional sections you would like to include in your README?',
        choices: [
            {
                name: 'Deployed Application',
                checked: false
            },
            {
                name: 'Installation',
                checked: false
            },
            {
                name: 'Screenshots',
                checked: true
            },
            {
                name: 'Built With',
                checked: true
            },
            {
                name: 'License',
                checked: false
            },
            {
                name: 'Contributing',
                checked: false
            },
            {
                name: 'Tests',
                checked: false
            },
            {
                name: 'Questions',
                checked: true
            },
            {
                name: 'Credits',
                checked: true
            },
        ]
    },
    {
        type: 'input',
        name: 'link',
        message: 'Please provide a link to your deployed application.',
        when: ({ contents }) => {
            if (contents.indexOf('Deployed Application') > -1) {
                return true;
            } else { 
                return false;
            }
        },
        validate: linkInput => {
            if (linkInput) {
                return true;
            } else {
                console.log('Please enter a link!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'installation',
        message: 'Please list any required packages for installation of your application.',
        when: ({ contents }) => {
            if (contents.indexOf('Installation') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: installInput => {
            if (installInput) {
                return true;
            } else {
                console.log('Please enter installation instructions!');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: 'license',
        message: 'Please provide license type.',
        choices: ['Public domain', 'Lesser general public license', 'Permissive', 'Copyleft', 'Proprietary'],
        default: 0,
        when: ({ contents }) => {
            if (contents.indexOf('License') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: licenseInput => {
            if (licenseInput) {
                return true;
            } else {
                console.log('Please provide license type!');
                return false;
            }
        }
    }, 
    {
        type: 'checkbox',
        name: 'built with',
        message: 'Please select the tech stack of your application.',
        choices: ['MEAN', 'MEARN', 'LAMP', 'Ruby on Rails', 'Serverless', 'Flutter for Web'],
        default: 0,
        when: ({ contents }) => {
            if (contents.indexOf('Built With') > -1) {
                return true;
            } else {
                return false;
            }
        }
    }, 
    {
        type: 'input',
        name: 'contributing',
        message: 'Please give your guidelines for contributing.',
        when: ({ contents }) => {
            if (contents.indexOf('Contributing') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: contributingInput => {
            if (contributingInput) {
                return true;
            } else {
                console.log('Please giver the guidelines for contributing!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'tests',
        message: 'Please enter test information for your application.',
        when: ({ contents }) => {
            if (contents.indexOf('Tests') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: testsInput => {
            if (testsInput) {
                return true;
            } else {
                console.log('What packages are required to run tests for your application?');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'questions',
        message: 'Please provide us with your email.',
        when: ({ contents }) => {
            if (contents.indexOf('Questions') > -1) {
                return true;
            } else { 
                return false;
            }
        },
        validate: questionsInput => {
            if (questionsInput) {
                return true;
            } else {
                console.log('Please provide your email address!');
                return false;
            }
        }
    }
];
// Addictional screenshots
const screenshotQues = [
    {
        type: 'input',
        name: 'screenshotLink',
        message: 'Please provide a link for your screenshot. (Required)',
        validate: screenshotLinkInput => {
            if (screenshotLinkInput) {
                return true;
            } else {
                console.log('Please provide a link for your screenshot!')
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'screenshotAlt',
        message: 'Please provide alt text for your screenshot. (Required)',
        validate: screenshotAltInput => {
            if (screenshotAltInput) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'screenshotDesc',
        message: 'Please provide a description of your screenshot. (Optional)'
    },
    {
        type: 'confirm',
        name: 'confirmAddScreenshot',
        message: 'Would you like to add another screenshot?',
        default: false
    }
];
// Prompts for adding credits
const creditQues = [
    {
        type: 'input',
        name: 'creditName',
        message: 'Please give your credit a name. (Required)',
        validate: creditName => {
            if (creditName) {
                return true;
            } else {
                console.log('Please enter a name for the credit!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'creditLink',
        message: 'Please provide a link for the credit.  (Required)',
        validate: creditLink => {
            if (creditLink) {
                return true;
            } else {
                console.log('Please enter a name for the credit!');
                return false;
            }
        }
    },
    {
        type: 'confirm',
        name: 'confirmAddCredit',
        message: 'Would you like to add another credit?',
        default: false
    }
]
// Add extra screenshots
addScreenshots = readmeData => {
    
  
    if (!readmeData.screenshots) {
        readmeData.screenshots = [];
    }
    console.log(`
==================
Add New Screenshot
==================
    `);
    return inquirer.prompt(screenshotQues)
    .then(screenshotData => {
         
        readmeData.screenshots.push(screenshotData);
         
        if (screenshotData.confirmAddScreenshot) {
            return addScreenshots(readmeData);
        } else {
            return readmeData;
        };
    });
};

addCredits = readmeInfo => {
    
     if (!readmeInfo.credits) {
        readmeInfo.credits = [];
    };
    console.log(`
==============
Add New Credit
==============
    `);
    return inquirer.prompt(creditQues)
    .then(creditData => {
         readmeInfo.credits.push(creditData);
         if (creditData.confirmAddCredit) {
            return addCredits(readmeInfo);
        } else {
            return readmeInfo;
        }
    });
};
// write README file
function writeToFile(fileName, data) {
    fs.writeFile(`./dist/${fileName}`, data, err => {
        if (err) {
            throw err
        };
        console.log('README created!')
    });
};
// function to initialize program
function init() {
    return inquirer.prompt(questions);
};
// Start program
init()
    .then(userResponse => { 
 
        if (userResponse.contents.indexOf('Screenshots') > -1) {
            return addScreenshots(userResponse);
        } else {
            return userResponse;
        }
    })
    .then(response => {
 
        if (response.contents.indexOf('Credits') > -1) {
            return addCredits(response);
        } else {
            return response;
        }
    })
    .then(answers => generateMarkdown(answers))
    .then(generatedReadme => writeToFile('README.md', generatedReadme))
    .catch(err => {
        console.log(err);
    });
