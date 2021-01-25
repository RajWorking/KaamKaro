import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
    maxWidth: 400,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const skills = [
  'Java',
  'Java Script',
  'CSS',
  'C++',
  'HTML',
  'Django',
  'React',
  'MERN',
  'Flutter',
  'Math'
];

function getStyles(skill, Skill, theme) {
  return {
    fontWeight: Skill.indexOf(skill) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({chip, Skill, handleSkillChange}) {
  const classes = useStyles();
  const theme = useTheme();

  const handleChange = (event) => {
    handleSkillChange(event.target.value)
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">{chip}</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={Skill}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {skills.map((skill) => (
            <MenuItem key={skill} value={skill} style={getStyles(skill, Skill, theme)}>
              {skill}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
