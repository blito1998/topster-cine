import React, {Componet} from 'react'
import Main from '../template/Main'


const headerProsps ={
    icon: 'users',
    title: 'Cadastre-se'

}


export default class UserCrud extends Componet {
    render() {
        return (
            <Main {...headerProsps}>
                Cadastro de Clientes
            </Main>
        )
    }
}