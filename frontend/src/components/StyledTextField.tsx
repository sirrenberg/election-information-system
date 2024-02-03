import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 1000,
  marginBottom: "2em",
  // input text color
  "& input": {
    color: "#000",
  },
  "& label": {
    color: "#111",
  },
  "& label.Mui-focused": {
    color: "#1d61ff",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1d61ff",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#718eff",
    },
    "&:hover fieldset": {
      borderColor: "#1d61ff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1d61ff",
    },
  },
}));

export default StyledTextField;
