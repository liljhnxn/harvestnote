// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HarvestNote
 * @dev Decentralized farming journal where farmers record harvests,
 * track quantities, and maintain on-chain farming records on Botchain Testnet.
 * Tagline: Every Harvest Has a Story.
 */
contract HarvestNote {
    struct Harvest {
        uint256 id;
        string cropName;
        uint256 quantity;
        string unit;
        string harvestDate;
        address farmer;
        uint256 createdAt;
        bool exists;
    }

    // Auto-incrementing harvest ID counter
    uint256 private _nextHarvestId = 1;

    // Total count of active (non-deleted) harvests
    uint256 private _activeHarvestCount = 0;

    // Mapping from harvest ID to Harvest record
    mapping(uint256 => Harvest) private _harvests;

    // List of all active harvest IDs
    uint256[] private _allHarvestIds;

    // Mapping from harvest ID to index in _allHarvestIds array (for O(1) removal)
    mapping(uint256 => uint256) private _harvestIdToIndex;

    // Mapping from farmer address to their active harvest IDs
    mapping(address => uint256[]) private _farmerHarvestIds;

    // Mapping from harvest ID to index in farmer's harvest array
    mapping(uint256 => uint256) private _farmerHarvestIndex;

    // Events
    event HarvestAdded(
        uint256 indexed id,
        address indexed farmer,
        string cropName,
        uint256 quantity,
        string unit,
        string harvestDate,
        uint256 timestamp
    );

    event HarvestUpdated(
        uint256 indexed id,
        address indexed farmer,
        string cropName,
        uint256 quantity,
        string unit,
        string harvestDate,
        uint256 timestamp
    );

    event HarvestDeleted(
        uint256 indexed id,
        address indexed farmer,
        uint256 timestamp
    );

    /**
     * @dev Add a new harvest entry.
     * @param cropName Name of the harvested crop (cannot be empty)
     * @param quantity Amount harvested (must be > 0)
     * @param unit Unit of measurement (e.g. kg, bags, baskets - cannot be empty)
     * @param harvestDate Date of the harvest (cannot be empty)
     * @return id The unique ID assigned to the new harvest
     */
    function addHarvest(
        string calldata cropName,
        uint256 quantity,
        string calldata unit,
        string calldata harvestDate
    ) external returns (uint256) {
        require(bytes(cropName).length > 0, "Crop name cannot be empty");
        require(quantity > 0, "Quantity must be greater than zero");
        require(bytes(unit).length > 0, "Unit cannot be empty");
        require(bytes(harvestDate).length > 0, "Harvest date cannot be empty");

        uint256 harvestId = _nextHarvestId++;

        Harvest memory newHarvest = Harvest({
            id: harvestId,
            cropName: cropName,
            quantity: quantity,
            unit: unit,
            harvestDate: harvestDate,
            farmer: msg.sender,
            createdAt: block.timestamp,
            exists: true
        });

        _harvests[harvestId] = newHarvest;

        // Track in global active IDs
        _harvestIdToIndex[harvestId] = _allHarvestIds.length;
        _allHarvestIds.push(harvestId);

        // Track in farmer's list of IDs
        _farmerHarvestIndex[harvestId] = _farmerHarvestIds[msg.sender].length;
        _farmerHarvestIds[msg.sender].push(harvestId);

        _activeHarvestCount++;

        emit HarvestAdded(
            harvestId,
            msg.sender,
            cropName,
            quantity,
            unit,
            harvestDate,
            block.timestamp
        );

        return harvestId;
    }

    /**
     * @dev Update an existing harvest record. Only the original farmer can update it.
     * @param id The ID of the harvest to update
     * @param cropName New crop name
     * @param quantity New quantity (must be > 0)
     * @param unit New unit
     * @param harvestDate New harvest date
     */
    function updateHarvest(
        uint256 id,
        string calldata cropName,
        uint256 quantity,
        string calldata unit,
        string calldata harvestDate
    ) external {
        require(_harvests[id].exists, "Harvest does not exist");
        require(_harvests[id].farmer == msg.sender, "Only farmer can modify record");
        require(bytes(cropName).length > 0, "Crop name cannot be empty");
        require(quantity > 0, "Quantity must be greater than zero");
        require(bytes(unit).length > 0, "Unit cannot be empty");
        require(bytes(harvestDate).length > 0, "Harvest date cannot be empty");

        Harvest storage h = _harvests[id];
        h.cropName = cropName;
        h.quantity = quantity;
        h.unit = unit;
        h.harvestDate = harvestDate;

        emit HarvestUpdated(
            id,
            msg.sender,
            cropName,
            quantity,
            unit,
            harvestDate,
            block.timestamp
        );
    }

    /**
     * @dev Delete a harvest record. Only the original farmer can delete it.
     * @param id The ID of the harvest to delete
     */
    function deleteHarvest(uint256 id) external {
        require(_harvests[id].exists, "Harvest does not exist");
        require(_harvests[id].farmer == msg.sender, "Only farmer can modify record");

        address farmer = msg.sender;

        // Remove from global active list using swap-and-pop
        uint256 globalIndex = _harvestIdToIndex[id];
        uint256 lastGlobalIndex = _allHarvestIds.length - 1;
        if (globalIndex != lastGlobalIndex) {
            uint256 lastId = _allHarvestIds[lastGlobalIndex];
            _allHarvestIds[globalIndex] = lastId;
            _harvestIdToIndex[lastId] = globalIndex;
        }
        _allHarvestIds.pop();
        delete _harvestIdToIndex[id];

        // Remove from farmer's active list using swap-and-pop
        uint256 fIndex = _farmerHarvestIndex[id];
        uint256 lastFIndex = _farmerHarvestIds[farmer].length - 1;
        if (fIndex != lastFIndex) {
            uint256 lastFarmerId = _farmerHarvestIds[farmer][lastFIndex];
            _farmerHarvestIds[farmer][fIndex] = lastFarmerId;
            _farmerHarvestIndex[lastFarmerId] = fIndex;
        }
        _farmerHarvestIds[farmer].pop();
        delete _farmerHarvestIndex[id];

        // Mark record as non-existent
        delete _harvests[id];

        _activeHarvestCount--;

        emit HarvestDeleted(id, farmer, block.timestamp);
    }

    /**
     * @dev Retrieve all active harvest IDs.
     */
    function getAllHarvestIds() external view returns (uint256[] memory) {
        return _allHarvestIds;
    }

    /**
     * @dev Retrieve a single harvest by ID.
     */
    function getHarvest(uint256 id) external view returns (Harvest memory) {
        require(_harvests[id].exists, "Harvest does not exist");
        return _harvests[id];
    }

    /**
     * @dev Retrieve all active harvest IDs belonging to a specific wallet.
     */
    function getHarvestsByFarmer(address farmer) external view returns (uint256[] memory) {
        return _farmerHarvestIds[farmer];
    }

    /**
     * @dev Retrieve total active harvest count.
     */
    function getTotalHarvestCount() external view returns (uint256) {
        return _activeHarvestCount;
    }

    /**
     * @dev Helper to retrieve all active harvest records in a single call.
     */
    function getAllHarvests() external view returns (Harvest[] memory) {
        uint256 count = _allHarvestIds.length;
        Harvest[] memory result = new Harvest[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = _harvests[_allHarvestIds[i]];
        }
        return result;
    }

    /**
     * @dev Helper to retrieve all active harvest records for a specific farmer.
     */
    function getFarmerHarvests(address farmer) external view returns (Harvest[] memory) {
        uint256[] memory ids = _farmerHarvestIds[farmer];
        uint256 count = ids.length;
        Harvest[] memory result = new Harvest[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = _harvests[ids[i]];
        }
        return result;
    }
}

