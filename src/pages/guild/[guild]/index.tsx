import { HStack, SimpleGrid, Stack, Tag, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CustomizationButton from "components/common/CustomizationButton"
import DeleteButton from "components/common/DeleteButton"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import { GuildProvider, useGuild } from "components/[guild]/Context"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import LogicDivider from "components/[guild]/LogicDivider"
import Members from "components/[guild]/Members"
import useMembers from "components/[guild]/Members/hooks/useMembers"
import RequirementCard from "components/[guild]/RequirementCard"
import { fetchGuild } from "components/[guild]/utils/fetchGuild"
import { GetStaticPaths, GetStaticProps } from "next"
import React from "react"
import useSWR from "swr"
import guilds from "temporaryData/guilds"
import { Guild } from "temporaryData/types"
import kebabToCamelCase from "utils/kebabToCamelCase"

const GuildPageContent = (): JSX.Element => {
  const { account } = useWeb3React()
  const { urlName, name, guildPlatforms, imageUrl, requirements, logic } = useGuild()

  const hashtag = `${kebabToCamelCase(urlName)}Guild`
  const isOwner = useIsOwner(account)
  const members = useMembers()

  return (
    <Layout
      title={name}
      action={
        <HStack spacing={2}>
          {guildPlatforms[0] && <JoinButton />}
          {isOwner && (
            <>
              <CustomizationButton />
              <EditButtonGroup editMode={false} />
              <DeleteButton />
            </>
          )}
        </HStack>
      }
      imageUrl={imageUrl}
    >
      <Stack spacing="12">
        <Section title="Requirements">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
            <VStack>
              {requirements?.map((requirement, i) => (
                <React.Fragment key={i}>
                  <RequirementCard requirement={requirement} />
                  {i < requirements.length - 1 && <LogicDivider logic={logic} />}
                </React.Fragment>
              ))}
            </VStack>
          </SimpleGrid>
        </Section>
        {/* <Section title={`Use the #${hashtag} hashtag!`}>
              <TwitterFeed hashtag={`${hashtag}`} />
            </Section> */}
        <Section
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">Members</Text>
              <Tag size="sm">
                {members?.filter((address) => !!address)?.length ?? 0}
              </Tag>
            </HStack>
          }
        >
          <Members members={members} fallbackText="This guild has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  guildData: Guild
}

const GuildPageWrapper = ({ guildData: guildDataInitial }: Props): JSX.Element => {
  const { data: guildData } = useSWR(
    ["guild", guildDataInitial.urlName],
    fetchGuild,
    {
      fallbackData: guildDataInitial,
    }
  )

  return (
    <GuildProvider data={guildData}>
      <GuildPageContent />
    </GuildProvider>
  )
}

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = guilds.find((i) => i.urlName === params.guild)

  const guildData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchGuild(null, params.guild?.toString())

  if (!guildData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { guildData },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    _.map(({ urlName: guild }) => ({ params: { guild } }))

  const pathsFromLocalData = mapToPaths(guilds)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetch(`${process.env.NEXT_PUBLIC_API}/guild`).then((response) =>
          response.ok ? response.json().then(mapToPaths) : undefined
        )

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }
export default GuildPageWrapper
