import { ActionPanel, Detail, List, Action, getPreferenceValues } from "@raycast/api";
import { Preferences, TeamworkProject } from "./utils";
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
    [preferences.endpoint + "/projects.json?pageSize=500"]
  );

  const getProjectUrl = (project: TeamworkProject) => {
    return `${preferences.endpoint}/app/projects/${project.id}`;
  };

  if (isLoading) {
    return <Detail isLoading={isLoading}></Detail>;
  }

  if (error) {
    return <Detail markdown={error.message} />;
  }

  return (
    <List
      actions={
        <ActionPanel>
          <Action title="Reload" onAction={() => revalidate()} />
        </ActionPanel>
      }
    >
      {data.projects.map((project: TeamworkProject, index: number) => {
        console.log(project);
        return (
          <List.Item
            key={`list-item-${index}`}
            icon="teamwork-icon.jpg"
            title={project?.name}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={getProjectUrl(project)} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
