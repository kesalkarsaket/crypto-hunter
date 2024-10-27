import { makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles({
  shimmer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  shimmerItem: {
    marginBottom: "0.5rem",
  },
});

const ShimmerUI = () => {
  const classes = useStyles();

  return (
    <div className={classes.shimmer}>
      {Array.from(new Array(10)).map((_, index) => (
        <Skeleton
          key={index}
          variant="rect"
          animation="wave"
          width="100%"
          height={50}
          className={classes.shimmerItem}
          color="lightgray"
        />
      ))}
    </div>
  );
};

export default ShimmerUI;
