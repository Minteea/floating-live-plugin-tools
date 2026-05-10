#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const program = new Command();

program
  .name("floating-live-plugin-tools")
  .description("Floating Live plugin tools CLI")
  .version("1.0.0");

program
  .command("info")
  .description("Display plugin information from plugin.json")
  .action(() => {
    const pluginPath = path.join(process.cwd(), "plugin.json");
    try {
      const raw = readFileSync(pluginPath, "utf-8");
      const json = JSON.parse(raw);
      if (!json.name) {
        throw new Error("plugin.json must contain a 'name' field");
      }
      console.log(`Plugin Name: ${json.name}`);
      if (json.version) console.log(`Plugin Version: ${json.version}`);
      if (json.author) console.log(`Plugin Author: ${json.author}`);
      if (json.repository) console.log(`Repository: ${json.repository}`);
      if (json.license) console.log(`License: ${json.license}`);
    } catch (error) {
      console.error("Failed to read plugin.json:", error instanceof Error ? error.message : error);
    }
  });

program
  .command("version")
  .description("Sync version from package.json to plugin.json in the current working directory")
  .action(() => {
    const cwd = process.cwd();
    const pkgPath = path.join(cwd, "package.json");
    const pluginPath = path.join(cwd, "plugin.json");

    try {
      const pkgRaw = readFileSync(pkgPath, "utf-8");
      const pluginRaw = readFileSync(pluginPath, "utf-8");

      const pkgJson = JSON.parse(pkgRaw);
      const pluginJson = JSON.parse(pluginRaw);

      if (typeof pkgJson.version !== "string") {
        throw new Error("package.json does not contain a valid version field");
      }

      pluginJson.version = pkgJson.version;
      writeFileSync(pluginPath, JSON.stringify(pluginJson, null, 2) + "\n", "utf-8");
      console.log(`Synced version ${pkgJson.version} to plugin.json`);
    } catch (error) {
      console.error("Failed to sync plugin.json version:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse(process.argv);