import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Users from "./pages/User/User";
import Order from "./pages/Order/Order";
import Book from "./pages/Book/Book";
import UserDetails from "./pages/User/UserDetail";
import Tag from "./pages/Tag/Tag";
import Author from "./pages/Author/Author";
import Publisher from "./pages/Publisher/Publisher";
import ShippingMode from "./pages/ShippingMode/ShippingMode";
import BookDetail from "./pages/Book/BookDetail";
import OrderDetail from "./pages/Order/OrderDetail";
import Rating from "./pages/Rating/Rating";

function App() {
    const token = localStorage.getItem("token");
    const isLoggedIn = token !== null;

    return (
        <div className="App">
            {isLoggedIn ? (
                <Switch>
                    <Route path="/sign-up" exact component={SignUp} />
                    <Route path="/sign-in" exact component={SignIn} />
                    <Main>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/dashboard" component={Home} />
                        <Route exact path="/user" component={Users} />
                        <Route exact path="/user/:id" component={UserDetails} />
                        <Route exact path="/order" component={Order} />
                        <Route exact path="/order/:id" component={OrderDetail} />
                        <Route exact path="/rating" component={Rating} />
                        <Route exact path="/book" component={Book} />
                        <Route exact path="/book/:id" component={BookDetail} />
                        <Route exact path="/tag" component={Tag} />
                        <Route exact path="/author" component={Author} />
                        <Route exact path="/publisher" component={Publisher} />
                        <Route exact path="/shipping-mode" component={ShippingMode} />
                    </Main>
                </Switch>
            ) : (
                <SignIn />
            )}
        </div>
    );
}

export default App;