import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../NavBar";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";

test('renders NavBar', () => {
    render(
    <Router>
        <NavBar />
    </Router>
    );

    // screen.debug();
    const signInLink = screen.getByRole('link', {name: 'Sign in'})
    expect(signInLink).toBeInTheDocument();
});


test('renders link to the user profile for the logged in user', async () => {
    render(
    <Router>
        <CurrentUserProvider>
        <NavBar />
        </CurrentUserProvider>
    </Router>
    );

    const profileAvatar = await screen.findByText('Profile');
    expect(profileAvatar).toBeInTheDocument();
});


test('renders Sign in and Sign put buttons again on logout', async () => {
    render(
    <Router>
        <CurrentUserProvider>
        <NavBar />
        </CurrentUserProvider>
    </Router>
    );

    const signOutLink = await screen.findByRole('link', {name: 'Sign out'});
    fireEvent.click(signOutLink);

    const signInLink = await screen.findByRole('link', {name: 'Sign in'});
    const signUpLink = await screen.findByRole('link', {name: 'Sign up'});

    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
});