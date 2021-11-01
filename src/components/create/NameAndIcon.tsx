import { FormControl, FormErrorMessage, HStack, Input } from "@chakra-ui/react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import IconSelector from "../create-guild/IconSelector"

const forbiddenNames = ["404", "guild", "group", "groups"]
const eastereggNames = ["hoodie", "Hoodie"]

const NameAndIcon = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const urlName = useWatch({ name: "urlName" })

  let [name, setName] = useState(urlName)

  return (
    <FormControl isRequired isInvalid={errors?.name}>
      <HStack spacing={2}>
        <IconSelector/>
        <Input
          size="lg"
          maxWidth="sm"
          {...register("name", {
            required: "This field is required.",
            maxLength: {
              value: 50,
              message: "The maximum possible name length is 50 characters",
            },
            validate: () =>
            !forbiddenNames.includes(urlName) || "Please pick a different name.",
          })}
          onChange={(e) => setName(e.target.value)}
        />
        <img src="/easterEggs/hoodieHead.png" width="64" height="64" style={eastereggNames.includes(name) ?
            {transition:'opacity 1500ms ease-out', opacity:'1'}:
            {transition:'opacity 1500ms ease-in',opacity:'0'}}/>
      </HStack>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default NameAndIcon
