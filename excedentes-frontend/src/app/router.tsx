import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../modules/home/pages/Home";
import { Login } from "../modules/login/pages/Login";
import { CreateProduct } from "../modules/product/pages/CreateProduct";
import Contratante from "../modules/cadastro/pages/Contratante";
import { Stock } from "../modules/stock/pages/Stock";
import Consumidor from "../modules/cadastro/pages/Consumidor";
import { EditProduct } from "../modules/product/pages/EditProduct";
import { DetailProduct } from "../modules/product/pages/DetailProduct";
import { Cart } from "../modules/cart/pages/Cart";
import { SobreExcedentes } from "../modules/sobreExcedentes/sobreExcedentes";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/estoque/cadastro-produto" element={<CreateProduct />} />
      <Route path="/estoque/editar-produto/:id" element={<EditProduct />} />
      <Route path="/estoque/detalhes-produto/:id" element={<DetailProduct />} />
      <Route path="/cadastro/consumidor" element={<Consumidor />} />
      <Route path="/cadastro/contratante" element={<Contratante />} />
      <Route path="/estoque" element={<Stock />} />
      <Route path="/carrinho" element={<Cart />} />
      <Route path="/sobre" element={<SobreExcedentes />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
