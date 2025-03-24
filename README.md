# IPEXCO Front-End

## Setup

### Dependencies

The dependencies are:

- `npm` (https://www.npmjs.com/)
- `node.js` version 22 (https://nodejs.org/en)
- *Angular CLI* version 19 (https://angular.dev/tools/cli/setup-local)


Before the first run install npm packages with:

```
npm install
```

### Run

To run the development server on the default port (`4200`) run:

```
npm start
```
If you want to use a different port run

```
ng serve --port <port>
```

### Back-End Setup

To run the back-end server natively we refer to the 
[README](https://github.com/r-eifler/IPEXCO-backend) of the back-end repository.

To set up the back-end server and the pre-build docker images see 
[Docker](setup/README.md).


## Platform Usage

### Register

When you open IPEXCO for the first time click on *Register*. 
Select a username and password. Make sure to save it. There is no option 
to reset your password.

### Iterative Planning for PDDL Domain

To start the iterative planning process for a classical planning problem, 
perform the following steps:

**Create a domain specification**

1. Go to the Menu in the top left corner and then to Specifications.
1. Add a domain specification for your planning problem. Give it a name and 
select as encoding `PPDL_CLASSIC`.
1. Edit the domain (*pencil* icon) to define goal templates. They are necessary 
to define goals during the iterative planning process. In the file 
`setup/example_data/blocksworld/templates.json` you can find some examples for 
the blocksworld domain. In [Section](#goal-templates) you find detailed 
instructions on how to define goal templates.
1. Don't forget to **save**.


**Register all required services**

How to obtain and run the docker images of the services is the 
[README](https://github.com/r-eifler/IPEXCO-backend) of the back-end repository.

1. Add a classical PDDL planner (e.g. [FD Planning Service](https://github.com/r-eifler/planner-service)) as a service. As type select `PLANNER` as 
URL `http:localhost:3333` (If you have not changed any of the default settings),
and as API Key what you defined in the *env* file of the planner docker container, 
as encoding `PPDL_CLASSIC`.
1. Add the classical property checker [Service](https://github.com/r-eifler/property_checker_service) as a service. As type select `PROPERTY_CHECKER` as 
URL `http:localhost:3335` (If you have not changed any of the default settings),
and as API Key what you defined in the *env* file of the property checker docker 
container, as encoding `PPDL_CLASSIC`.
1. Add the classical explainer [Service](https://github.com/r-eifler/explainer-service) 
as a service. As type select `EXPLAINER` as 
URL `http:localhost:3335` (If you have not changed any of the default settings),
and as API Key what you defined in the *env* file of the explainer docker 
container, as encoding `PPDL_CLASSIC`.

**Create a Project**

1. Now go back to the main menu (top left corner) and select Projects.
1. Create a new project and select as domain the one you just created.
In the next step you can upload the PDDL domain and problem file.
The parser might take a few seconds, but the form will indicate once the 
problem definition has been successfully processed. Then you can create the 
project.
1. Click on the right arrow of the new created project.
1. Go to Settings.
1. Select the Planner, Explainer and Property Checker you just registered.
1. As interfaces select *Templates* for both property creation and explanations.
1. Save the settings.
1. Go back to the main overview of the project (*house* icon in the top).


**Iterative Planning**

1. Start the iterative planning process.
1. To create your first iteration step, click on the card stating 
*Perform a new plan computation from scratch*. A side panel on the right opens.
1. Define your first property. Click on *Add Property* in the section for 
*Enforced Goals* and then in the dialog on *Create New Property*.
A new dialog to create properties opens.
(**Note**: If there are no options in the dialog, this means something is wrong 
with the goal templates you defined in the domain specification.)
1. Select a property class and then a property.
1. Instantiate a property by selecting all required objects. 
1. (optionally) In the third step you can change the name, description and 
utility of the property if you want.
1. Click *Create*.
1. Select the just created property and then click *Select*.
1. Finish the creation of the iteration by clicking *Create* in the bottom 
right corner of the side panel.
1. You are automatically redirected to the details' page of the new created 
iteration step.


You find more instructions about the interface and an introduction to the 
explanation interface in the platform's manual. To access it click on the 
question mark in the top right corner.

### Demos

A demo is an iterative planning task with a **fixed** set of properties.
This allows to precompute all MUGS/MCGS, resulting in an almost instant response 
to a user question. 
Additionally, it gives a fair evaluation environment for user studies, since 
every participant processes the same optimization task.

To compute a demo perform the following steps. 

1. Go to the main menu of the project, and then to the **Demos** feature.
1. Click on *Create a new demo based on the current project*.
1. Define a name.
1. Domain and instance description are shown during a user study to explain the 
domain and the concrete instance to the user.
1. The optional image is also used to facilitate the understanding of the domain 
to the user during a user study.
1. The last step is to select the goals/properties. You can choose from the 
properties defined during the iterative planning in the domain and create new 
properties. Make sure to rename them if necessary and that you assign the correct
utility value.
1. Click *save* to create the demo and start the pre-computation of all MUGS/MCGS.
This can take some time.

Once the computation of a demo finished you can click on *Details* to access 
an overview of all MUGS/MCGS and the settings of the demo. 

**Share Demos** In the top right corner of the demos details view, you can download
the demo as a JSON file. This allows you to share demos between instances of 
IPEXCO. To upload the demo go to the main demos menu in the left navigation bar 
and click *Upload Demo*. 


### Goal Templates

**TODO**

### LLM Prompts

**TODO**

### Beluga Demonstrator

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


