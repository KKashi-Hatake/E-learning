import {createContext, useContext} from 'react'

export const Context = createContext({
    userData:{},
    toggleUserData:()=>{},
    user:true,
    toggleUser:()=>{},
    theme:'light',
    toggleTheme:()=>{}
})

export const useTheme=()=>{
    return useContext(Context)
}

export const ThemeProvider= Context.Provider;