# IPEXCO

## Install & Run

1. install **npm**
2. `npm install`
3. `npm start` 


## Create Demo

### Upload PDDL Files

1. Go to PDDL Database tab
1. Upload `domain_XXX.pddl` file
1. Upload `problem_XXX.pddl` file
1. Upload domain specification, `domain_definition_XXX.json`

### Create Project

1. Go to Project Tab
1. Create new Project (plus bottom right corner)
1. select matching *domain*, *problem* files and *domain specification*
1. Name and Description must not be empty

### Add Plan Properties/Soft Goals
1. Go to Project -> Plan Properties Tab

2. Create your own properties (plus top right corner) by selecting a 
    template and then objects...

or load plan properties from user study.

1. Go to **plus top right corner** -> **expert mode** -> **choose file**
1. Upload `plan_properties.text` file
1. **Reload page** (then all properties should be displayed)
1. Select plan properties that should be used in the demo (used check box on the left)


### Compute Demo

1. **Overview** -> **Create Demo** 
1. Name and Description must not be empty
1. `Save`
1. Demo Overview should contain a new demo 
1. It can take quite some time to compute the demo (30-60 min for user study instances)
1. Once the computation is finished the process bar disappears

### Adapt Demo Settings

1. Go to Settings **three dots top right corner of demo** -> **Settings**
1. Features **Questions/Answers** or **MUGS Visualization**
1. Automatic Computation: **Plans** and **Explanations**
1. `Save`
1. Reload page
    
    
# Run Demo

1. press `play`


