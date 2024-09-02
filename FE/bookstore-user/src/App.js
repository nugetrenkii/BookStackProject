import logo from './logo.svg';
import Home from './pages/Home/Home';
import Navbar from './pages/Navbar/Navbar';
import Register from './pages/Register';
import './App.css';
import SignIn from './pages/SignIn';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Book from './pages/Book/Book';
import Footer from './pages/Footer/Footer';
import BookDetail from './pages/Book/BookDetail';
import Cart from './pages/Cart/Cart';
import Account from './pages/Account/Account';
import Address from './pages/Address/Address';
import Order from './pages/Order/Order';
import History from './pages/History/History';
import HistoryDetail from './pages/History/HistoryDetail';
import Rating from './pages/Rating/Rating';
import Payment from './pages/Payment/Payment';

function Layout() {
  return (
    <div className="main-screen">
      <Navbar />
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background : "#F0F0F0"
      }}>
        <div
          style={{
            width: "70vw",
            minHeight: "calc(100vh - 250px)",

            // display: "flex",
            // alignItems: "center"
          }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path='book' element={<Book />} />
          <Route path='book/:id' element={<BookDetail />} />

          <Route path='cart' element={<Cart />} />

          <Route path='account' element={<Account />} />
          <Route path='account/address' element={<Address />} />

          <Route path='account/history' element={<History />} />
          <Route path='account/history/:id' element={<HistoryDetail />} />
          
          <Route path='order' element={<Order />} />

          <Route path='rating/:id' element={<Rating />} />

          <Route path='/vnpay-return' element={<Payment />} />

          {/* <Route path="/booking" element={<Booking />} />

          <Route path='service' element={<Service />} />
          <Route path='service/:id' element={<ServiceDetails />} />

          <Route path='hair-style' element={<ViewHairStyle />} />
          <Route path='hair-style/:id' element={<HairStyleDetail />} />

          <Route path='shop' element={<Shop />} />

          <Route path='/my' element={<MyProfile />} />
          <Route path='/my-walet' element={<MyWalet />} />
          <Route path='/my-history' element={<MyHistoryBooking />} />
          <Route path='/my-history/:id' element={<BookingDetails />} />
          <Route path='/change-password' element={<ChangPass />} />

          <Route path='/rate' element={<Rate />} />

          <Route path='/vnpay-return' element={<VnPay />} />
          <Route path='/payin-return' element={<PayIn />} /> */}
        </Route>

        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<Register />} />
        {/* <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path='/verify-return' element={<Verify />} />
        <Route path='*' element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
