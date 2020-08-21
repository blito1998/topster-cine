import React, { Component } from 'react';
import api from './api';

class App extends Component{

  state ={
    filmes: [],
  }
  
  async componentDidMount(){
    const response = await api.get('/filmes')

    //console.log(response.data)

    this.setState({filmes: response.data})
  }

  render(){

    const {filmes} = this.state;

    console.log(filmes);

    return(
      <div>
        <h1> lista filme</h1>
        <ul>
          {filmes.map(filme =>(
            <li key ={filme._id} >
              <h2>Titulo: {filme.titulo}
                  Sipopse: {filme.sinopse}
              </h2>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default App;
