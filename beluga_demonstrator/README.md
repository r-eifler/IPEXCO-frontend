# Beluga Demonstrator

For the general setup of IPEXCO please check out the main README.


### Basic Plan Generation Use Case

To compute a plan for a domain dependent Beluga instance, perform the following 
steps

**Create Beluga domain and register planner**:

1. Go to the Menu in the top left corner and then to Specifications.
1. Add a Beluga Domain. Give it a name containing *Beluga* and select as encoding 
    `DOMAIN_DEPENDENT`.
1. Add the simple Beluga planner as a service. As type select `PLANNER` as 
URL `http:localhost:3336` (If you have not changed any of the default settings),
as API Key what you defined in the *env* file of the docker container, as 
encoding `DOMAIN_DEPENDENT` and as domain the Beluga domain you just created.

**Create a *Project* and compute the first plan**:

1. Now go back to the main menu (top left corner) and select Projects.
1. Create a new project and select as domain the just created Beluga domain.
In the next step you can upload a Beluga JSON file from the competition.
An example file is given in `setup/example_data/beluga/json`.
1. Click on the right arrow of the new created project.
1. To test and compare different planner *start* the *Planning* feature.
1. Create a new plan. You should be able to select the simple Beluga planner 
you registered in the beginning.
1. If everything works you should get a plan within a few seconds for the included 
sample problem.
1. The *Details* of a plan gives you for now only a list of the action names.