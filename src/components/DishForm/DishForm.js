import React, { useState } from "react";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TimePicker from "@mui/lab/TimePicker";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";

import axios from "axios";

const StyledForm = styled.form`
  width: 500px;
  padding: 50px;
  margin: 50px 0;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.5);
`;

const DishForm = () => {
  const [dishName, setDishName] = useState("");
  const [preperation_time, setPreperation_time] = useState(
    new Date("2022-03-01T00:00:00")
  );
  const [type, setType] = useState("");
  const [no_of_slices, setNumOfSlices] = useState("");
  const [diameter, setDiameter] = useState("");
  const [spicines, setSpicines] = useState(1);
  const [error, setError] = useState({});

  const chandleSubmit = (e) => {
    const data = {
      name: dishName,
      preparation_time: preperation_time.toLocaleTimeString(),
      type: type.toLowerCase(),
      ...(type === "PIZZA" && {
        no_of_slices: parseInt(no_of_slices),
      }),
      ...(type === "SANDWICH" && {
        slices_of_bread: parseInt(no_of_slices),
      }),
      ...(type === "PIZZA" && {
        diameter: parseFloat(diameter),
      }),
      ...(type === "SOUP" && {
        spiciness_scale: spicines,
      }),
    };

    const handleSucces = () => {
      setDishName("");
      setPreperation_time("2022-03-01T00:00:00");
      setType("");
      setNumOfSlices("");
      setDiameter("");
      setSpicines(0);
      setError({});
    };

    axios
      .post(
        "https://frosty-wood-6558.getsandbox.com:443/dishes",
        JSON.stringify(data),
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then((e) => console.log(e.data))
      .then(() => handleSucces())
      .catch((e) => setError(e.response.data));

    e.preventDefault();
  };

  const marks = [
    {
      value: 1,
      label: "1",
    },

    {
      value: 10,
      label: "10",
    },
  ];

  return (
    <StyledForm onSubmit={(e) => chandleSubmit(e)}>
      <Stack spacing={5}>
        <Typography variant="h3" component="h2" sx={{ margin: "0 auto" }}>
          Order Dish
        </Typography>

        <TextField
          label="Dish Name"
          value={dishName}
          required
          onChange={(e) => setDishName(e.target.value)}
          error={!!error.name}
          helperText={error.name}
        />

        <LocalizationProvider dateAdapter={DateAdapter}>
          <TimePicker
            ampm={false}
            openTo="hours"
            views={["hours", "minutes", "seconds"]}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            label="Preparation time"
            value={preperation_time}
            required
            onChange={(newValue) => {
              setPreperation_time(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormHelperText
            sx={{ color: "red", position: "absolute", top: "315px" }}
          >
            {error.preparation_time}
          </FormHelperText>
        </LocalizationProvider>

        <FormControl error={!!error.type}>
          <FormLabel>Dish type</FormLabel>
          <RadioGroup row>
            <FormControlLabel
              control={<Radio required={true} value="PIZZA" />}
              checked={type === "PIZZA"}
              label="Pizza"
              onChange={() => setType("PIZZA")}
              onSubmit={(e) => (e.target.value = false)}
            />
            <FormControlLabel
              control={<Radio required={true} value="SOUP" />}
              checked={type === "SOUP"}
              label="Soup"
              onChange={() => setType("SOUP")}
            />
            <FormControlLabel
              control={<Radio required={true} value="SANDWICH" />}
              checked={type === "SANDWICH"}
              label="Sandwich"
              onChange={() => setType("SANDWICH")}
            />
          </RadioGroup>
          <FormHelperText>{error.type}</FormHelperText>
        </FormControl>

        {type === "PIZZA" || type === "SANDWICH" ? (
          <TextField
            label="Number of slices"
            value={no_of_slices}
            required
            inputProps={{
              inputMode: "decimal",
            }}
            onChange={(e) => {
              setNumOfSlices(e.target.value.replace(/\D/g, ""));
            }}
            error={!!error.no_of_slices || !!error.slices_of_bread}
            helperText={error.no_of_slices || error.slices_of_bread}
          />
        ) : (
          ""
        )}

        {type === "PIZZA" ? (
          <TextField
            label="Diameter"
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            error={!!error.diameter}
            helperText={error.diameter}
            inputProps={{
              inputMode: "numeric",
              step: "0.01",
            }}
          />
        ) : (
          ""
        )}

        {type === "SOUP" ? (
          <FormControl>
            <FormLabel>Spiciness</FormLabel>
            <Slider
              value={spicines}
              required
              onChange={(e) => setSpicines(e.target.value)}
              min={1}
              max={10}
              step={1}
              marks={marks}
              valueLabelDisplay="auto"
            />
          </FormControl>
        ) : (
          ""
        )}

        <Button type="submit" variant="contained">
          SUBMIT
        </Button>
      </Stack>
    </StyledForm>
  );
};

export default DishForm;
