# Getting Started

## Creating an account

You can start working on Neurodiffhub by creating your account by navigating to the "Sign Up" feature. Enter the necessary details requested and then log in with your credentials to get started.

## What is a Project? 

Once you create your account, a default Project will be created with the title of your username. You can proceed to add more projects if you want to by naivagting to 'Settings' under your profile picture. 

You can think of a Project as an analogy to a Github repo. You can store multiple equations under the same project and also share your project with other members of the hub by searching for the member's username in the 'Search' option present. 

## How do I start using it?  

You need to first pip install the following into your notebook or terminal:
```
pip install git+https://github.com/NeuroDiffGym/neurodiffeq.git
```

Note: Be sure to include an ! before pip install... if you are using a notebook.

After the previous step, you can proceed to import your libraries. Remember to run the following lines of code before you proceed to load or save models. 

NOTE: This code should be run as the first cell in your notebook. 

```
# Set the dev to 1 when working with dev version and to 0 when working with production version
import os
os.environ["DEV"] = "1"

# Signup to neurodiffeq, go to settings and choose API Keys and generate a new key
# Copy paste that API-key here
os.environ["NEURODIFF_API_KEY"] = #Your API Key that you can get from visiting your 'Profile' page.
```

### Loading Model

You can proceed to load your model from your default project by using the following code:

```
# Load the pretrained solver directly from the hub
solver = Solver1D.load(name="Name-of-the-user/Equation_name")
```

If you want to load a model from a specific project name, use the following code:

```
#Load the pretrained solver from a project
solver = Solver1D.load(name="Project-name/Equation_name")
```

Note: You can also use the versions by specifying the version name in the `name` field above. 

```
#Load the pretrained solver from a project of version x
solver = Solver1D.load(name="Project-name/Equation_name-version-x")
```

You can then perform all the actions under the specific solver object. 

### Saving Model

You can proceed to save your model to your default project i.e. your 'username' Project by using the following code:

```
#Saving your solution to the hub
solver.save(name="Equation_name", save_to_hub = True)
```

If you want to save your model to a specific project, make sure to use the following code:

```
#Saving your solution to a specific project
solver.save(name="Project-name/Equation_name", save_to_hub = True)
```

If you want to save locally, make sure to use the following code:

```
#Saving you solution locally
solver.save(name="Equation_name",save_to_hub=False,path="path to save to")
```
