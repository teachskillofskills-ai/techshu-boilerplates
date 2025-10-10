#!/usr/bin/env node

/**
 * TechShu Boilerplates CLI
 *
 * Created by: Indranil Banerjee
 * Title: Head of AI Transformation, INT TechShu
 * LinkedIn: https://in.linkedin.com/in/askneelnow
 * Email: hi@indranil.in
 * Work: indranil.banerjee@intglobal.com
 *
 * © 2025 TechShu - All Rights Reserved
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

const REGISTRY_URL = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main/registry.json';
const BASE_URL = 'https://raw.githubusercontent.com/teachskillofskills-ai/techshu-boilerplates/main';

interface Boilerplate {
  id: string;
  name: string;
  category: string;
  version: string;
  description: string;
  tags: string[];
  files: number;
  components?: number;
  lib?: number;
  path: string;
  dependencies: string[];
}

interface Registry {
  boilerplates: Boilerplate[];
  version: string;
  name: string;
}

const program = new Command();

program
  .name('techshu')
  .description('CLI tool to fetch TechShu boilerplates and components\nCreated by Indranil Banerjee - Head of AI Transformation, INT TechShu')
  .version('1.0.0')

// Show author info on help
program.on('--help', () => {
  console.log('')
  console.log(chalk.gray('Created by:'))
  console.log(chalk.cyan('  Indranil Banerjee'))
  console.log(chalk.gray('  Head of AI Transformation, INT TechShu'))
  console.log(chalk.gray('  LinkedIn: https://in.linkedin.com/in/askneelnow'))
  console.log('')
});

// List all boilerplates
program
  .command('list')
  .description('List all available boilerplates')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (options) => {
    const spinner = ora('Fetching boilerplates...').start();
    
    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      spinner.succeed('Boilerplates loaded');
      
      let boilerplates = data.boilerplates;
      
      if (options.category) {
        boilerplates = boilerplates.filter(b => b.category === options.category);
      }
      
      console.log(chalk.bold.cyan(`\n${data.name} v${data.version}\n`));
      
      const grouped = boilerplates.reduce((acc, b) => {
        if (!acc[b.category]) acc[b.category] = [];
        acc[b.category].push(b);
        return acc;
      }, {} as Record<string, Boilerplate[]>);
      
      Object.entries(grouped).forEach(([category, items]) => {
        console.log(chalk.bold.yellow(`\n${category.toUpperCase()}`));
        items.forEach(b => {
          console.log(chalk.green(`  ${b.id}`) + chalk.gray(` - ${b.description}`));
          console.log(chalk.gray(`    Files: ${b.files} | Components: ${b.components || 0} | Lib: ${b.lib || 0}`));
        });
      });
      
      console.log(chalk.gray(`\nTotal: ${boilerplates.length} boilerplates\n`));
    } catch (error) {
      spinner.fail('Failed to fetch boilerplates');
      console.error(chalk.red(error));
    }
  });

// Search boilerplates
program
  .command('search <query>')
  .description('Search for boilerplates')
  .action(async (query) => {
    const spinner = ora('Searching...').start();
    
    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      spinner.succeed('Search complete');
      
      const results = data.boilerplates.filter(b => 
        b.id.includes(query.toLowerCase()) ||
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.description.toLowerCase().includes(query.toLowerCase()) ||
        b.tags.some(t => t.includes(query.toLowerCase()))
      );
      
      if (results.length === 0) {
        console.log(chalk.yellow('\nNo results found\n'));
        return;
      }
      
      console.log(chalk.bold.cyan(`\nFound ${results.length} result(s):\n`));
      results.forEach(b => {
        console.log(chalk.green(`  ${b.id}`) + chalk.gray(` - ${b.description}`));
        console.log(chalk.gray(`    Category: ${b.category} | Files: ${b.files}`));
        console.log(chalk.gray(`    Tags: ${b.tags.join(', ')}\n`));
      });
    } catch (error) {
      spinner.fail('Search failed');
      console.error(chalk.red(error));
    }
  });

// Get info about a boilerplate
program
  .command('info <boilerplate>')
  .description('Get detailed information about a boilerplate')
  .action(async (boilerplateId) => {
    const spinner = ora('Fetching information...').start();
    
    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      const boilerplate = data.boilerplates.find(b => b.id === boilerplateId);
      
      if (!boilerplate) {
        spinner.fail(`Boilerplate "${boilerplateId}" not found`);
        return;
      }
      
      spinner.succeed('Information loaded');
      
      console.log(chalk.bold.cyan(`\n${boilerplate.name} v${boilerplate.version}\n`));
      console.log(chalk.gray(boilerplate.description));
      console.log(chalk.gray(`\nCategory: ${boilerplate.category}`));
      console.log(chalk.gray(`Path: ${boilerplate.path}`));
      console.log(chalk.gray(`\nFiles: ${boilerplate.files}`));
      console.log(chalk.gray(`Components: ${boilerplate.components || 0}`));
      console.log(chalk.gray(`Lib files: ${boilerplate.lib || 0}`));
      console.log(chalk.gray(`\nTags: ${boilerplate.tags.join(', ')}`));
      
      if (boilerplate.dependencies.length > 0) {
        console.log(chalk.gray(`\nDependencies:`));
        boilerplate.dependencies.forEach(dep => {
          console.log(chalk.gray(`  - ${dep}`));
        });
      }
      
      console.log(chalk.gray(`\nTo add: ${chalk.green(`techshu add ${boilerplate.id}`)}\n`));
    } catch (error) {
      spinner.fail('Failed to fetch information');
      console.error(chalk.red(error));
    }
  });

// Add a boilerplate
program
  .command('add <boilerplate>')
  .description('Add a boilerplate to your project')
  .option('-p, --path <path>', 'Destination path', './src')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (boilerplateId, options) => {
    const spinner = ora('Fetching boilerplate...').start();
    
    try {
      const { data } = await axios.get<Registry>(REGISTRY_URL);
      const boilerplate = data.boilerplates.find(b => b.id === boilerplateId);
      
      if (!boilerplate) {
        spinner.fail(`Boilerplate "${boilerplateId}" not found`);
        return;
      }
      
      spinner.text = `Downloading ${boilerplate.name}...`;
      
      const destPath = path.join(process.cwd(), options.path, boilerplate.id);
      
      // Check if destination exists
      if (await fs.pathExists(destPath) && !options.force) {
        spinner.stop();
        const { overwrite } = await inquirer.prompt([{
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${destPath} already exists. Overwrite?`,
          default: false
        }]);
        
        if (!overwrite) {
          console.log(chalk.yellow('Cancelled'));
          return;
        }
        spinner.start();
      }
      
      // Download files
      await downloadBoilerplate(boilerplate, destPath, spinner);
      
      spinner.succeed(chalk.green(`${boilerplate.name} added successfully!`));
      
      console.log(chalk.cyan(`\nLocation: ${destPath}`));
      
      if (boilerplate.dependencies.length > 0) {
        console.log(chalk.yellow(`\nInstall dependencies:`));
        console.log(chalk.gray(`  npm install ${boilerplate.dependencies.join(' ')}`));
      }
      
      console.log(chalk.gray(`\nRead the README: ${destPath}/README.md\n`));
      
    } catch (error) {
      spinner.fail('Failed to add boilerplate');
      console.error(chalk.red(error));
    }
  });

async function downloadBoilerplate(boilerplate: Boilerplate, destPath: string, spinner: ora.Ora) {
  // Create destination directory
  await fs.ensureDir(destPath);

  // Use GitHub API to get directory contents
  const githubApiUrl = `https://api.github.com/repos/teachskillofskills-ai/techshu-boilerplates/contents/${boilerplate.path}`;

  try {
    const { data } = await axios.get(githubApiUrl);

    if (!Array.isArray(data)) {
      throw new Error('Invalid response from GitHub API');
    }

    // Download all files and directories
    for (const item of data) {
      if (item.type === 'file') {
        spinner.text = `Downloading ${item.name}...`;
        await downloadFile(item.download_url, path.join(destPath, item.name));
      } else if (item.type === 'dir') {
        spinner.text = `Downloading ${item.name}/...`;
        await downloadDirectoryRecursive(item.path, path.join(destPath, item.name), spinner);
      }
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`Boilerplate "${boilerplate.id}" not found in repository`);
    }
    throw error;
  }
}

async function downloadDirectoryRecursive(githubPath: string, destPath: string, spinner: ora.Ora) {
  await fs.ensureDir(destPath);

  const githubApiUrl = `https://api.github.com/repos/teachskillofskills-ai/techshu-boilerplates/contents/${githubPath}`;

  try {
    const { data } = await axios.get(githubApiUrl);

    if (!Array.isArray(data)) {
      return;
    }

    for (const item of data) {
      if (item.type === 'file') {
        const fileName = path.basename(item.name);
        spinner.text = `Downloading ${githubPath}/${fileName}...`;
        await downloadFile(item.download_url, path.join(destPath, fileName));
      } else if (item.type === 'dir') {
        await downloadDirectoryRecursive(item.path, path.join(destPath, item.name), spinner);
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
    console.log(chalk.gray(`  Skipping ${githubPath} (not found or empty)`));
  }
}

async function downloadFile(url: string, destPath: string) {
  try {
    const { data } = await axios.get(url, { responseType: 'text' });
    await fs.writeFile(destPath, data, 'utf-8');
  } catch (error: any) {
    console.log(chalk.yellow(`  Warning: Failed to download ${path.basename(destPath)}`));
  }
}

program.parse();

