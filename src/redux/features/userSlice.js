import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    isAuthenticated: false
}

// localStorage-dan təhlükəsiz oxuma
try {
    const storedAuthStatus = localStorage.getItem("isAuthenticated")
    const storedUser = localStorage.getItem("user")

    if (storedAuthStatus) {
        initialState.isAuthenticated = JSON.parse(storedAuthStatus)
    }

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        // Pozulmuş data yoxlaması — role mütləq olmalıdır
        if (parsedUser && parsedUser.user && parsedUser.user.role) {
            initialState.user = parsedUser
        } else {
            // Pozulmuş datanı təmizlə
            localStorage.removeItem("user")
            localStorage.removeItem("isAuthenticated")
        }
    }
} catch (e) {
    // JSON.parse xətası — localStorage-ı təmizlə
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload
            localStorage.setItem("isAuthenticated", JSON.stringify(action.payload))
        },
        logout(state) {
            state.user = null
            state.isAuthenticated = false
            localStorage.removeItem("isAuthenticated")
            localStorage.removeItem("user")
        }
    }
})

export default userSlice.reducer
export const { setUser, setIsAuthenticated, logout } = userSlice.actions