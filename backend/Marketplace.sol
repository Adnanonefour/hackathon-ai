// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StoryNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("ComicIntegrity", "CINT") Ownable(msg.sender) {}

    function mintStory(address author, string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(author, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }
}