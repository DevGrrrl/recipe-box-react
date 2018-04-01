import React from "react";
import render from "react-dom";
import Recipe from "./Recipe";
import RecipeModal from "./RecipeModal";

class MainForm extends React.Component {
  constructor() {
    super();
    this.state = {
      recipes: JSON.parse(localStorage.getItem("recipes")) || [
        {
          id: 0,
          name: "pie",
          ingredients: ["pastry", "oil", "carrots"],
          view: false
        },
        {
          id: 1,
          name: "lunch",
          ingredients: ["pastry", "oil", "carrots"],
          view: false
        },
        {
          id: 2,
          name: "dinner",
          ingredients: ["pastry", "oil", "carrots"],
          view: false
        }
      ],
      addIngredients: "",
      addName: "",
      addRecipeModalState: false,
      editRecipeModalState: false,
      currentRecipe: 0
    };

    this.handleRecipeName = this.handleRecipeName.bind(this);
    this.handleRecipeSubmit = this.handleRecipeSubmit.bind(this);
    this.createNewRecipe = this.createNewRecipe.bind(this);
    this.handleIngredients = this.handleIngredients.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.deleteRecipes = this.deleteRecipes.bind(this);
    this.toggleAddRecipeModal = this.toggleAddRecipeModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleRecipeView = this.toggleRecipeView.bind(this);
    this.changeState = this.changeState.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
  }

  changeState(e, cb) {
    let id = e.target.value;
    let recipes = [...this.state.recipes];
    let newArr = recipes.map(elem => {
      if (elem.id == id) {
        elem.view = !elem.view;
        return elem;
      } else {
        elem.view = false;
        return elem
      }
    });
    cb(newArr);
  }
  toggleRecipeView(e) {
    console.log(e.target.value)
    e.preventDefault();
    this.changeState(e, res => {
      this.setState({
        recipes: res,
        currentRecipe: e.target.value
      });
    });
  }

  toggleAddRecipeModal(e) {
    e.preventDefault();
    this.setState({
      addRecipeModalState: !this.state.addRecipeModalState
    });
  }

  toggleEditModal(e) {
    // console.log(e.target.value)
    e.preventDefault();
    this.setState({
      editRecipeModalState: !this.state.editRecipeModalState,
    })
  }

  deleteRecipes(name, recipes, cb) {
    //delete via key instead
    let newArr = [];
    let filtered = recipes;
    filtered = filtered.filter(e => {
      return !(e.name === name);
    });
    cb(filtered);
  }

  handleDelete(e) {
    e.preventDefault();
    const name = e.target.value;
    let recipes = [...this.state.recipes];
    let newArr;
    this.deleteRecipes(name, recipes, function(res) {
      newArr = res;
    });

    localStorage.setItem("recipes", JSON.stringify(newArr));

    this.setState({
      recipes: JSON.parse(localStorage.getItem("recipes"))
    });
  }

  handleRecipeName(e) {
    const value = e.target.value;
    this.setState({
      addName: value
    });
  }

  handleIngredients(e) {
    const value = e.target.value;
    this.setState({
      addIngredients: value
    });
  }

  createNewRecipe(cb) {
    let ingredients = this.state.addIngredients;
    ingredients = ingredients.split(",");
    const name = this.state.addName;

    //generate unique id
    const recipes = this.state.recipes;
    const length = this.state.recipes.length;
    const lastId = this.state.recipes[length - 1].id;
    const newRecipe = {
      id: lastId + 1,
      name: name,
      ingredients: ingredients,
      view: false
    };
    recipes.push(newRecipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    cb(recipes);
  }

  handleRecipeSubmit(e) {
    e.preventDefault();
    this.createNewRecipe(recipes => {
      const updatedRecipes = recipes;
      this.setState({
        recipes: updatedRecipes,
        addName: "",
        addIngredients: ""
      });
    });
  }

  handleEditSubmit(e){
    e.preventDefault()
    //replace old recipe with new one;
    const recipes = [ ...this.state.recipes];
    let ingredients = this.state.addIngredients;
    ingredients = ingredients.split(",");
    const name = this.state.addName;

    let editedRecipe = recipes.filter(elem=>{
      if(elem.id == this.state.currentRecipe){
        elem.name = name
        elem.ingredients =ingredients
        return elem;
      }
    })
  
   const localStorageRecipes = JSON.parse(localStorage.getItem('recipes'));
   let newArr= localStorageRecipes.map(e=>{
     if(e.id == this.state.currentRecipe){
       e.name = editedRecipe[0].name;
       e.ingredients = editedRecipe[0].ingredients;
       return e;
     } else {
       return e;
     }
   })
   localStorage.setItem('recipes', JSON.stringify(newArr))
   this.setState({
    recipes: JSON.parse(localStorage.getItem("recipes"))
  });
  }

  render() {
    const getRecipes = recipes => {
      return recipes.map((elem, i) => {
        return (
          <Recipe
            key={i}
            id={elem.id}
            recipe={elem.name}
            element={elem}
            handleDelete={this.handleDelete}
            handleEdit={this.handleEdit}
            toggleEditModal={this.toggleEditModal}
            toggleRecipeView={this.toggleRecipeView}
            recipeViewState={elem.view}
            editRecipeModalState={this.state.editRecipeModalState}
            handleRecipeName ={this.handleRecipeName}
            handleIngredients ={this.handleIngredients}
            name={this.state.AddName}
            addIngredients={this.state.addIngredients}
            handleEditSubmit={this.handleEditSubmit}
          />
        );
      });
    };

    return (
      <div>
        <div>{getRecipes(this.state.recipes)}</div>
        <RecipeModal
        
          toggleAddRecipeModal={this.toggleAddRecipeModal}
          addRecipeModalState={this.state.addRecipeModalState}
          ingredients={this.state.addIngredients}
          name={this.state.addName}
          handleRecipeName={this.handleRecipeName}
          handleIngredients={this.handleIngredients}
          handleRecipeSubmit={this.handleRecipeSubmit}
        />
      </div>
    );
  }
}

export default MainForm;