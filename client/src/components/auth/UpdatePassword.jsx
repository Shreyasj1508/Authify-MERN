import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
import { RxUpdate } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apis from "../../utils/apis";
import LoadingButton from "../ui/LoadingButton";

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const passwordChnage = (event) => {
    setPassword(event.target.value);
  };
  const confirmPasswordChnage = (event) => {
    setConfirmPassword(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(apis().updatePassword, {
        method: "POST",
        body: JSON.stringify({
          password,
          confirmPassword,
          token: localStorage.getItem("passToken"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setLoading(false);
      if (!response.ok) {
        throw new Error(result?.message);
      }

      if (result?.status) {
        toast.success(result?.message);
        navigate("/login");
        localStorage.removeItem("email");
        localStorage.removeItem("passToken");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth_main">
      <form onSubmit={submitHandler}>
        <div className="auth_container">
          <div className="auth_header">
            <RxUpdate />
            <p className="auth_heading">New Password</p>
            <p className="auth_title">enter at least 6-digit long password</p>
          </div>
          <div className="auth_item">
            <label>Password *</label>
            <Input
              onChange={passwordChnage}
              type="text"
              required
              placeholder="new password"
            />
          </div>
          <div className="auth_item">
            <label>confirm password *</label>
            <Input
              onChange={confirmPasswordChnage}
              type="text"
              placeholder="confirm password"
              required
            />
          </div>
          <div className="auth_action">
            <Button>
              <LoadingButton loading={loading} title="Update Password" />
            </Button>
          </div>
          <div>
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};
export default UpdatePassword;