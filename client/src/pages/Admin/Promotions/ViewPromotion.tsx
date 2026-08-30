import {
  useParams,
} from "react-router-dom";

import PromotionForm from "./PromotionForm";

const ViewPromotion = () => {
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
      mode="view"
      promotionId={id}
    />
  );
};

export default ViewPromotion;