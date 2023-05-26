import { ActionPanel, Detail, List, Action, getPreferenceValues } from "@raycast/api";
import { Preferences, TeamworkPeople, TeamworkProject } from "./utils";
import { useCachedPromise } from "@raycast/utils";
import { fetch } from "cross-fetch";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const token = Buffer.from(preferences.accessToken, "utf8").toString("base64");

  const { error, isLoading, data, revalidate } = useCachedPromise(
    async (url: string) => {
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${token}`,
        },
        method: "GET",
      });
      const result = await response.json();
      return result;
    },
    [preferences.endpoint + "/projects/api/v3/people.json?pageSize=500"]
  );
  
  if (isLoading) {
    return <Detail isLoading={isLoading}></Detail>;
  }

  if (error) {
    return <Detail markdown={error.message} />;
  }

  return (
    <List 
      isShowingDetail
      actions={
        <ActionPanel>
          <Action title="Reload" onAction={() => revalidate()} />
        </ActionPanel>
      }
    >
      {data.people.map((person: TeamworkPeople, index: number) => {
        console.log(person)
        return (
          <List.Item
            key={`list-item-${index}`}
            icon={person.avatarUrl}
            title={`${person?.firstName} ${person?.lastName}`}
            detail={
              <List.Item.Detail metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title={`${person?.firstName} ${person?.lastName}`}/>
                </List.Item.Detail.Metadata>
              }>
              </List.Item.Detail>
            }
            // actions={
              // <ActionPanel>
              //   <Action.OpenInBrowser url={getProjectUrl(project)} />
              // </ActionPanel>
            // }
          />
        );
      })}
    </List>
  );
}
