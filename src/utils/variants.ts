const PrimaryDuration = 2.5;
const StaggerDuration = 0.04;

export const ContainerVariant = {
  open: {
    // backgroundColor: "rgb(229, 229, 229)",
    backgroundColor: "rgb(38, 38, 38)",
    // backgroundColor: "rgb(23, 23, 23)",
    borderRadius: 6,
    width: "auto",
    height: "auto",
    transition: {
      duration: PrimaryDuration,
      // when: "beforeChildren",
      staggerChildren: StaggerDuration,
    },
  },
  close: {
    backgroundColor: "rgb(38, 38, 38)",
    // backgroundColor: "rgb(23, 23, 23)",
    borderRadius: 100,
    height: 100,
    width: 100,
    transition: {
      duration: PrimaryDuration,
      // when: "afterChildren",
      // staggerChildren: StaggerDuration,
      // staggerDirection: -1,
    },
  },
};

export const TitleVariant = {
  open: {
    // color: "rgb(23, 23, 23)",
    color: "rgb(229, 229, 229)",
    top: 0,
    translateY: 0,
    transition: {
      duration: PrimaryDuration / 2,
    },
  },
  close: {
    color: "rgb(229, 229, 229)",
    top: "50%",
    translateY: "-50%",
    transition: {
      duration: PrimaryDuration,
    },
  },
};

export const MemberVariant = {
  open: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: PrimaryDuration,
      delay: StaggerDuration * (idx + 1),
    },
  }),
  close: {
    opacity: 0,
    y: 200,
    transition: {
      duration: PrimaryDuration / 2,
    },
  },
};
