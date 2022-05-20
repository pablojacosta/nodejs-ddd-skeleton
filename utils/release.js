const { execSync } = require("child_process");

const setupHerokuCli = () => {
    try {
        execSync(`npm i -g heroku`);
    } catch (error) {
        console.log(error);
    }
}


const run = async () => {
    if (process.env.HEROKU_API_KEY) {
        setupHerokuCli();
    }
    
    process.exit(0)
}

run().catch(console.error);