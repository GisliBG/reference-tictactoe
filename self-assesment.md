1. jenkins : see myschool
2. aws: http://35.160.42.253/
3. git: https://github.com/GisliBG/reference-tictactoe

Scripts

Outline what script files you created and the purpose of each file. Each file should be commented. This could be
    
    Dependency-injection.sh 
    #used to install and run all dependencies that jenkins will need to run correctly.
    #It also starts the build process if the test pass.
    
    startTests.sh
    #executed from the dependency-injection script. It simply starts the unit-tests,
    #needs to set CI variable to true so jenkins won't linger for an input. 
    
    dockerbuild.sh
    #executed from dependency aswell. It builds a new docker image from our last succesful build 
    #and tags it with the git commit id. After it has completed to build the image will be bushed to docker hub.

    deployment.sh
    #executed after the api and load tests pass. It copy's the docker-compose file to aws in case it
    #has been changed and also sends .env which tells docker what git commit tag we are currently using
    #so we can get to correct image.

    provision.sh
    #restarts the docker images and everything will run on aws.
    #I know I should have something that takes care this process not loosing all the data in the database
    #but I couldn't find time :( 

Testing & logic

Outline what tests you created.

    UnitTests, server logic TDD (Git commit log):
    https://github.com/GisliBG/reference-tictactoe/commit/fc5327ba77348cc0d96e543abdd6b75d5e7cf78a
    https://github.com/GisliBG/reference-tictactoe/commit/f682b581591fb9a16bc05d2392642db2022b35cc
    https://github.com/GisliBG/reference-tictactoe/commit/07718f02e58522d4b3f391c9fadd1bcdf33b5519
    https://github.com/GisliBG/reference-tictactoe/commit/ca6d7b37f89a34b5e22f561998c1163bbed80476
    https://github.com/GisliBG/reference-tictactoe/commit/5c3488cdccf093210fb275d92c496ae5f97eec1e
    https://github.com/GisliBG/reference-tictactoe/commit/a0e982268c631016426d05346cd18b2eb1049eda
    https://github.com/GisliBG/reference-tictactoe/commit/aa650d3ccb9212499ad2d90732125f02c3fc831f
    https://github.com/GisliBG/reference-tictactoe/commit/e3b03135ce08b60b93f33701a045d324cb74bd75

    API Acceptance test - fluent API
    -Yes works fine

    Load test loop
    -Yes work fine
    
    UI TDD
    -nope 

    Is the game playable?
    -nope
Data migration

Did you create a data migration.

    Migration up and down
    -nope 
Jenkins

Do you have the following Jobs and what happens in each Job:

    Commit Stage
    #yes - runs unit tests, builds the application and sends the artifact to docker hub.

    Acceptance Stage
    #yes - it runs if the commit stage passes 

    Capacity Stage
    #yes - it runs if the acceptance stage passes 
    
    #deploy-stage 
    #deploys to aws if everything passes.

Did you use any of the following features in Jenkins?

    Schedule or commit hooks
    - yes
    Pipeline
    - yes some sort 
    Jenkins file
    - No
    Test reports
    - yes, you can see test report on jenkins, 
    Other

Monitoring

Did you do any monitoring?

    URL to monitoring tool. Must be open or include username and pass.
    no nothing
Other

Anything else you did to improve you deployment pipeline of the project itself?
    No I think this is it. I just wan't to say thanks for the class it was challenging but I feel
    I've learned a lot.
 
----