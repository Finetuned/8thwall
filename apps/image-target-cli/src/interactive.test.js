import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import os from 'os'

import {normalizePath, selectPlanarGeometry} from './interactive.js'

const mockRl = (chooseValue, confirmValue, integers = []) => {
  let i = 0
  return {
    choose: async () => chooseValue,
    confirm: async () => confirmValue,
    promptInteger: async () => integers[i++],
    promptFloat: async () => {
      throw new Error('Unexpected promptFloat call')
    },
    prompt: async () => '',
    close: () => {},
  }
}

describe('selectPlanarGeometry', () => {
  const metadata = {width: 600, height: 800}
  it('landscape + default crop', async () => {
    const crop = await selectPlanarGeometry(
      mockRl('landscape', true),
      metadata
    )

    assert.equal(crop.isRotated, true)
    // Post-rotation: 600x800 rotated -> 800x600
    assert.equal(crop.originalWidth, 800)
    assert.equal(crop.originalHeight, 600)
    // Rotated effective: 800x600. 800/3=266.7 > 600/4=150 -> width cropped.
    // croppedWidth = Math.round(600 * 3 / 4) = 450
    // left = Math.round((800 - 450) / 2) = 175
    assert.equal(crop.width, 450)
    assert.equal(crop.height, 600)
    assert.equal(crop.left, 175)
    assert.equal(crop.top, 0)
  })
  it('portrait + default crop', async () => {
    const crop = await selectPlanarGeometry(mockRl('portrait', true), metadata)

    assert.equal(crop.isRotated, false)
    // Not rotated: 600x800. 600/3=200, 800/4=200 -> equal, else branch.
    // croppedHeight = Math.round(600 * 4 / 3) = 800
    assert.equal(crop.width, 600)
    assert.equal(crop.height, 800)
    assert.equal(crop.left, 0)
    assert.equal(crop.top, 0)
  })
  it('portrait + manual crop computes 4:3 height', async () => {
    const rl = mockRl('portrait', false, [10, 20, 600])
    const crop = await selectPlanarGeometry(rl, metadata)

    assert.equal(crop.top, 10)
    assert.equal(crop.left, 20)
    assert.equal(crop.width, 600)
    // Portrait height = Math.round(600 * 4 / 3) = 800
    assert.equal(crop.height, 800)
    assert.equal(crop.isRotated, false)
    assert.equal(crop.originalWidth, 600)
    assert.equal(crop.originalHeight, 800)
  })
  it('landscape + manual crop computes 3:4 height', async () => {
    const crop = await selectPlanarGeometry(
      mockRl('landscape', false, [0, 0, 400]),
      metadata
    )

    assert.equal(crop.width, 400)
    // Landscape height = Math.round(400 * 3 / 4) = 300
    assert.equal(crop.height, 300)
    assert.equal(crop.isRotated, true)
  })
})

describe('normalizePath', () => {
  it('resolves a simple absolute path', () => {
    assert.equal(normalizePath('/foo/bar'), '/foo/bar')
  })

  it('strips double quotes', () => {
    assert.equal(normalizePath('"/foo/bar"'), '/foo/bar')
  })

  it('strips single quotes', () => {
    assert.equal(normalizePath('\'/foo/bar\''), '/foo/bar')
  })

  it('unescapes backslash-spaces', () => {
    assert.equal(normalizePath('/foo/bar\\ baz'), '/foo/bar baz')
  })

  it('expands tilde to home directory', () => {
    assert.equal(normalizePath('~/docs'), `${os.homedir()}/docs`)
  })

  it('throws on empty input', () => {
    assert.throws(() => normalizePath(''), /Invalid path input/)
  })
  it('throws on null', () => {
    assert.throws(() => normalizePath(null), /Invalid path input/)
  })
})
