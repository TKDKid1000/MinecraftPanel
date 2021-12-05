#!/usr/bin/env node

const {hideBin} = require("yargs/helpers")
const {command} = require("../build/cli")

command.parse(hideBin(process.argv))