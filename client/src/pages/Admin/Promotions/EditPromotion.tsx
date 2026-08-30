import {
  useParams,
} from "react-router-dom";

import PromotionForm from "./PromotionForm";

const EditPromotion = () => {
  const { id } =
    useParams<{
      id: string;
    }>();

  if (!id) {
    return (
      <div>
        Invalid promotion.
      </div>
    );
  }

  return (
    <PromotionForm
      mode="edit"
      promotionId={id}
    />
  );
};

export default EditPromotion;