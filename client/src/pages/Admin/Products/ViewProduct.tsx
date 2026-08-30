import { useParams } from "react-router-dom";

import ProductForm from "./ProductForm";

const ViewProduct = () => {
  const { id } = useParams<{
    id: string;
  }>();

  if (!id) {
    return (
      <div>
        Invalid product.
      </div>
    );
  }

  return (
    <ProductForm
      mode="view"
      productId={id}
    />
  );
};

export default ViewProduct;