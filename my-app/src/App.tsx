import TokenStaking from "./TokenStaking"
import NFTStaking from "./NFTStaking";
import Header from "./components/header";
import TopNav from "./components/topnav";
import Footer from "./components/footer";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactImageGallery from "react-image-gallery";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <TopNav />
      <Router>
        <Routes>
          <Route path="/" element={<TokenStaking />} />
          <Route path="/nft-staking" element={<NFTStaking />} />
        </Routes>
      </Router>
      <Footer />
    </>
  )
}

export default App;