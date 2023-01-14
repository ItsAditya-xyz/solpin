import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
function Profile(props) {
  const { publicKey } = useParams();
  const [publicKeyVal, setPublicKeyVal] = useState(null);

  useEffect(() => {
    if (!publicKey) return;
    setPublicKeyVal(publicKey);
  }, [publicKey]);
  return <div>TEST</div>;
}

export default Profile;
