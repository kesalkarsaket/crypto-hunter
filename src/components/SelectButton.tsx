import { makeStyles } from "@material-ui/core";

interface SelectButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const useStyles = makeStyles({
  selectButton: {
    border: "1px solid gold",
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Montserrat",
    cursor: "pointer",
    backgroundColor: (props: SelectButtonProps) =>
      props.selected ? "gold" : "",
    color: (props: SelectButtonProps) => (props.selected ? "black" : ""),
    fontWeight: (props: SelectButtonProps) => (props.selected ? 700 : 500),
    "&:hover": {
      backgroundColor: "gold",
      color: "black",
    },
    width: "22%",
    textAlign: "center",
  },
});

const SelectButton: React.FC<SelectButtonProps> = ({
  children,
  selected,
  onClick,
}) => {
  const classes = useStyles({
    selected,
    children: undefined,
    onClick: function (): void {
      throw new Error("Function not implemented.");
    },
  });

  return (
    <span onClick={onClick} className={classes.selectButton}>
      {children}
    </span>
  );
};

export default SelectButton;
