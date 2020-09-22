import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/core";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
  useMeQuery,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";
import { useRouter } from "next/router";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const router = useRouter();
  const { data: meData } = useMeQuery();
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (!meData?.me?.id) {
            router.push("/login");
          } else if (post.voteStatus === 1) {
            return;
          } else {
            setLoadingState("updoot-loading");
            await vote({
              variables: {
                postId: post.id,
                value: 1,
              },
              update: (cache) => updateAfterVote(1, post.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        variant={post.voteStatus ? "outline" : "ghost"}
        variantColor={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "updoot-loading"}
        aria-label="updoot post"
        icon="chevron-up"
      />
      {post.points !== 0 ? post.points : null}
      <IconButton
        onClick={async () => {
          if (!meData?.me?.id) {
            router.push("/login");
          } else if (post.voteStatus === -1) {
            return;
          } else {
            setLoadingState("downdoot-loading");
            await vote({
              variables: {
                postId: post.id,
                value: -1,
              },
              update: (cache) => updateAfterVote(-1, post.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        variant={post.voteStatus ? "outline" : "ghost"}
        variantColor={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downdoot-loading"}
        aria-label="downdoot post"
        icon="chevron-down"
      />
    </Flex>
  );
};
