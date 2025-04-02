import React, { useEffect, useRef, useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import Button from "../ui/Button";
import BackToLogin from "../ui/BackToLogin";
import "../auth/auth.css";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apis from "../../utils/apis";
import LoadingButton from "../ui/LoadingButton";
const VerifyOtp = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const navigate = useNavigate();
  const inputRef = [ref1, ref2, ref3, ref4, ref5, ref6];
  const [loading, setLoading] = useState(false);
  const [isexpire, setIsExpire] = useState(false);
  const [otpTime, setOtpTime] = useState(null);
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");

  const otpArray = [setOtp1, setOtp2, setOtp3, setOtp4, setOtp5, setOtp6];
  const getTime = async () => {
    try {
      const response = await fetch(apis().getOtpTime, {
        method: "POST",
        body: JSON.stringify({ token: localStorage.getItem("passToken") }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      if (result?.status) {
        const remaningTime =
          new Date(result?.sendTime).getTime() - new Date().getTime();

        if (remaningTime > 0) {
          setOtpTime(remaningTime);
        } else {
          setIsExpire(true);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (ref1.current) {
      ref1.current.focus();
    }
    getTime();
  }, []);

  const inputChnage = (event, location) => {
    if (location < 5 && event.target.value) {
      inputRef[location + 1].current.focus();
    }
    otpArray[location](event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    try {
      setLoading(true);
      const response = await fetch(apis().otpVerify, {
        method: "POST",
        body: JSON.stringify({ otp: finalOtp }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setLoading(false);
      if (!response.ok) {
        throw new Error(result?.message);
      }
      if (result?.status) {
        toast.success(result?.message);
        navigate("/password/update");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resendHandler = async () => {
    try {
      const response = await fetch(apis().forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email: localStorage.getItem("email") }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      if (result?.status) {
        toast.success(result?.message);
        localStorage.setItem("passToken", result?.token);
        setOtpTime(1 * 60 * 1000);
        setIsExpire(false);
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
            <FaFingerprint />
            <p className="auth_heading">Verify your OTP</p>
            <p className="auth_title">
              Enter 6-digit OTP here we just sent at your email
            </p>
          </div>
          <div className="auth_item">
            <label>OTP *</label>
            <div className="otp_input_container">
              {inputRef.map((item, index) => {
                return (
                  <input
                    required
                    key={index}
                    onChange={(event) => inputChnage(event, index)}
                    ref={item}
                    onInput={(event) => {
                      if (event.target.value.length > 1) {
                        event.target.value = event.target.value.slice(0, 1);
                      }
                    }}
                    type="number"
                    className="ui_input otp_input"
                  />
                );
              })}
            </div>
          </div>
          <div className="auth_action">
            <Button>
              <LoadingButton loading={loading} title="Verify" />
            </Button>
          </div>
          <div>
            {otpTime !== null && !isexpire ? (
              <Timer setIsExpire={setIsExpire} time={otpTime} />
            ) : (
              <span onClick={resendHandler} className="otp_resend_action">
                Resend
              </span>
            )}
          </div>
          <div>
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};
export default VerifyOtp;