import { numberInputAnatomy as parts } from "@chakra-ui/anatomy"
import {
  mode,
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"

const size: Record<string, SystemStyleObject> = {
  lg: {
    borderRadius: "xl",
  },

  md: {
    borderRadius: "xl",
  },

  sm: {
    borderRadius: "md",
  },

  xs: {
    borderRadius: "md",
  },
}

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  lg: {
    field: size.lg,
  },
  md: {
    field: size.md,
  },
  sm: {
    field: size.sm,
  },
  xs: {
    field: size.xs,
  },
}

const variantOutline: PartsStyleFunction<typeof parts> = (props) => {
  return {
    field: {
      bg: mode("white", "blackAlpha.300")(props),
    },
  }
}

const variants = {
  outline: variantOutline,
}

const styles = {
  parts: ["field"],
  defaultProps: {
    focusBorderColor: "primary.500",
  },
  sizes,
  variants,
}

export default styles